import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Chat level: one session. Loads the history tail page on open, appends
 * pages upward (loadOlder), folds live mux frames in as they arrive, and
 * sends prompts through session.prompt.
 *
 * Rendering mirrors the desktop web UI's fold discipline on a small screen:
 * - reasoning text hides behind a collapsed "深度思考" disclosure,
 * - tool calls behind a collapsed tool disclosure (name + arguments),
 * - very long assistant text collapses with an explicit expand toggle,
 * - a toolbar above the composer carries the model (+ thinking effort) and
 *   permission pickers, both as bottom sheets.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { loadHistory, prompt } from "./App.js";
import { errorText, formatTime, staleHostHint } from "./App.js";
import { models, selectModel, sendCommand } from "../api.js";
import { foldEvents } from "../messages.js";
import { ThemeToggle } from "../theme-toggle.js";
/** Extract the raw event from one history entry (the fold consumes events only). */
function eventOf(entry) {
    return entry.event;
}
/** Defensive runtime guard for projection payloads. */
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/** Parse the wire `permissions` projection defensively; undefined when absent. */
function parsePermissionSelect(value) {
    if (!isRecord(value))
        return undefined;
    const rawOptions = Array.isArray(value['options']) ? value['options'] : [];
    const options = [];
    for (const raw of rawOptions) {
        if (!isRecord(raw))
            continue;
        const optionValue = typeof raw['value'] === 'string' ? raw['value'] : undefined;
        const name = typeof raw['name'] === 'string' ? raw['name'] : undefined;
        if (optionValue === undefined || name === undefined)
            continue;
        options.push({
            value: optionValue,
            name,
            ...(typeof raw['description'] === 'string' ? { description: raw['description'] } : {}),
        });
    }
    const currentValue = typeof value['currentValue'] === 'string' ? value['currentValue'] : undefined;
    if (currentValue === undefined || options.length === 0)
        return undefined;
    return { options, currentValue };
}
/** One display-name transform for kebab-case machine names (web-UI parity). */
function displayName(name) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name))
        return name;
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
/** First non-empty line of reasoning text (the collapsed summary). */
function firstMeaningfulLine(text) {
    const trimmed = text.trim();
    if (trimmed === '')
        return '';
    const newline = trimmed.indexOf('\n');
    return newline === -1 ? trimmed : trimmed.slice(0, newline);
}
/**
 * Render one session's chat.
 * @param props - the session, the mux client, and the back action.
 * @returns the chat surface.
 */
export function ChatView({ session, mux, onBack }) {
    const [messages, setMessages] = useState([]);
    const [hasOlder, setHasOlder] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(undefined);
    const pendingRef = useRef(false);
    /** The session's permission select (absent = capability not composed). */
    const [permissions, setPermissions] = useState(undefined);
    /** The current model selection for the toolbar chip (best-effort label). */
    const [currentModel, setCurrentModel] = useState(undefined);
    /** Which bottom sheet is open. */
    const [sheet, setSheet] = useState(null);
    // Tail page on open (content loads only when the session is opened).
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(undefined);
        setMessages([]);
        void loadHistory(session.sessionId).then((page) => {
            if (cancelled)
                return;
            setMessages(foldEvents(page.events.map(eventOf)));
            setHasOlder(page.hasMore);
            setLoading(false);
            // The history-tail projection baseline seeds the permission picker.
            // The `permissions` key is declared by the deployment's permission
            // plugin (augmentation), so the base SDK map is indexed loosely.
            const projections = page.projections?.values;
            setPermissions(parsePermissionSelect(projections?.['permissions']));
        }, (reason) => {
            if (cancelled)
                return;
            setError(errorText(reason));
            setLoading(false);
        });
        // Best-effort current-model label for the toolbar chip; the sheet
        // always re-reads a fresh directory on open.
        void models(session.sessionId).then((directory) => {
            if (!cancelled)
                setCurrentModel(directory.current);
        }, () => { });
        return () => { cancelled = true; };
    }, [session.sessionId]);
    // Live frames: fold session events for this session in as they arrive.
    useEffect(() => {
        if (mux === undefined)
            return;
        return mux.onFrame((frame) => {
            if (frame.type === 'session/event') {
                if (frame.sessionId !== session.sessionId)
                    return;
                setMessages(previous => foldEvents([frame.event], previous));
                return;
            }
            // Live projection pushes keep the permission picker current.
            if (frame.type === 'session/projection'
                && frame.sessionId === session.sessionId
                && frame.key === 'permissions') {
                setPermissions(parsePermissionSelect(frame.value));
            }
        });
    }, [mux, session.sessionId]);
    const scrollToBottom = useCallback(() => {
        const el = scrollRef.current;
        if (el === undefined)
            return;
        el.scrollTop = el.scrollHeight;
    }, []);
    // Track the last message's fold key so scrolling only fires when the
    // newest message actually changes (seq bump and/or pending flip). Runs
    // after React has committed the render, so scrollHeight reflects the
    // freshly appended content.
    const lastMessageKeyRef = useRef(undefined);
    // Keep the newest content visible. This covers the initial tail page (the
    // effect runs after commit, fixing the stale scrollHeight from the old
    // open-time scrollToBottom), live streaming chunks on the pending message,
    // and finalized/appended messages. Prepending older pages via loadOlder
    // leaves the last message untouched, so it never disturbs the scroll position.
    useEffect(() => {
        const last = messages[messages.length - 1];
        if (last === undefined)
            return;
        const key = last.seq + ':' + (last.pending === true ? 'p' : 'f');
        if (key === lastMessageKeyRef.current)
            return;
        lastMessageKeyRef.current = key;
        scrollToBottom();
    }, [messages, scrollToBottom]);
    /** Load one older page and prepend it. The fold is directional (incremental
     *  tails only), so the older page folds standalone and concatenates ahead —
     *  host page boundaries never cut a message, so the seam is exact. */
    const loadOlder = useCallback(() => {
        if (pendingRef.current)
            return;
        pendingRef.current = true;
        setLoading(true);
        const first = messages[0];
        if (first === undefined) {
            pendingRef.current = false;
            setLoading(false);
            return;
        }
        void loadHistory(session.sessionId, first.seq).then((page) => {
            pendingRef.current = false;
            setLoading(false);
            const older = foldEvents(page.events.map(eventOf));
            setMessages(previous => [...older, ...previous]);
            setHasOlder(page.hasMore);
        }, (reason) => {
            pendingRef.current = false;
            setLoading(false);
            setError(errorText(reason));
        });
    }, [session.sessionId, messages]);
    /** Send the drafted prompt (the echoed user/message arrives over mux). */
    const send = useCallback(() => {
        const text = input.trim();
        if (text === '' || sending)
            return;
        setSending(true);
        void prompt(session.sessionId, text).then(() => {
            setSending(false);
            setInput('');
        }, (reason) => {
            setSending(false);
            setError(errorText(reason));
        });
    }, [input, sending, session.sessionId]);
    const modelLabel = currentModel?.model ?? '模型';
    const permissionLabel = permissions === undefined
        ? undefined
        : permissions.options.find(option => option.value === permissions.currentValue)?.name
            ?? displayName(permissions.currentValue);
    return (_jsxs("div", { className: "chat", children: [_jsxs("header", { className: "mobile-header", children: [_jsx("button", { type: "button", className: "mobile-back", "aria-label": "\u8FD4\u56DE", onClick: onBack, children: "\u2039" }), _jsx("h1", { className: "mobile-title mobile-titleInline", children: session.title }), _jsx(ThemeToggle, {})] }), error !== undefined && _jsx("p", { className: "mobile-error mobile-pad", children: error }), _jsxs("div", { className: "chat-scroll", ref: ref => { scrollRef.current = ref ?? undefined; }, children: [hasOlder && (_jsx("button", { type: "button", className: "chat-load-older", disabled: loading, onClick: () => { void loadOlder(); }, children: loading ? '加载中…' : '加载更早的消息' })), messages.map(message => _jsx(MessageRow, { message: message }, message.id)), loading && messages.length === 0 && _jsx("p", { className: "chat-typing", children: "\u52A0\u8F7D\u4E2D\u2026" }), !loading && messages.length === 0 && _jsx("p", { className: "chat-typing", children: "\u8FD8\u6CA1\u6709\u6D88\u606F\uFF0C\u53D1\u4E00\u53E5\u8BDD\u5F00\u59CB\u5427" })] }), _jsxs("div", { className: "chat-tools", children: [_jsxs("button", { type: "button", className: "chat-chip", onClick: () => { setSheet('model'); }, "aria-haspopup": "dialog", children: [_jsx("span", { className: "chat-chip-label", children: "\u6A21\u578B" }), _jsx("span", { className: "chat-chip-value", children: modelLabel }), _jsx("span", { className: "chat-chip-chevron", "aria-hidden": true, children: "\u203A" })] }), permissionLabel !== undefined && (_jsxs("button", { type: "button", className: "chat-chip", onClick: () => { setSheet('permission'); }, "aria-haspopup": "dialog", children: [_jsx("span", { className: "chat-chip-label", children: "\u6743\u9650" }), _jsx("span", { className: "chat-chip-value", children: permissionLabel }), _jsx("span", { className: "chat-chip-chevron", "aria-hidden": true, children: "\u203A" })] }))] }), _jsxs("div", { className: "chat-inputbar", children: [_jsx("textarea", { className: "chat-input", rows: 1, value: input, placeholder: "\u8F93\u5165\u6D88\u606F\uFF0CEnter \u53D1\u9001\u2026", enterKeyHint: "send", onChange: (event) => { setInput(event.target.value); }, onKeyDown: (event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                void send();
                            }
                        } }), _jsx("button", { type: "button", className: "chat-send", disabled: sending || input.trim() === '', onClick: () => { void send(); }, children: sending ? '发送中…' : '发送' })] }), sheet === 'model' && (_jsx(ModelSheet, { sessionId: session.sessionId, current: currentModel, onCurrent: (selection) => { setCurrentModel(selection); }, onClose: () => { setSheet(null); } })), sheet === 'permission' && permissions !== undefined && (_jsx(PermissionSheet, { sessionId: session.sessionId, value: permissions, onChanged: (value) => {
                    setPermissions(previous => previous === undefined ? previous : { ...previous, currentValue: value });
                }, onClose: () => { setSheet(null); } }))] }));
}
/* ── message rows ─────────────────────────────────────────────────────── */
/** One rendered message row (user bubble or assistant bubble with folds). */
function MessageRow({ message }) {
    return (_jsxs("div", { className: `chat-msg chat-msg-${message.kind}${message.pending === true ? ' chat-msg-pending' : ''}${message.failed === true ? ' chat-msg-failed' : ''}`, children: [message.kind === 'assistant' && message.reasoning !== undefined && message.reasoning !== '' && (_jsx(ReasoningDisclosure, { text: message.reasoning, pending: message.pending === true })), message.kind === 'assistant' && message.tools !== undefined && message.tools.length > 0 && (_jsx(ToolDisclosure, { tools: message.tools })), _jsx(CollapsibleText, { text: message.text }), message.failed === true && _jsx("span", { className: "chat-msg-failtag", children: "\u672C\u6B21\u56DE\u590D\u5931\u8D25" }), _jsx("span", { className: "chat-msg-time", children: formatTime(message.time) })] }));
}
/** Collapsed-by-default reasoning disclosure (web-UI Think-row parity). */
function ReasoningDisclosure({ text, pending }) {
    const [open, setOpen] = useState(false);
    const summary = pending ? lastLine(text) : firstMeaningfulLine(text);
    return (_jsxs("div", { className: `chat-disclosure chat-reasoning${open ? ' chat-disclosure-open' : ''}`, "data-pending": pending || undefined, children: [_jsxs("button", { type: "button", className: "chat-disclosure-head", "aria-expanded": open, onClick: () => { setOpen(value => !value); }, children: [_jsx("span", { className: "chat-disclosure-caret", "aria-hidden": true, children: "\u203A" }), _jsx("span", { className: "chat-disclosure-label", children: pending ? '思考中…' : '深度思考' }), !open && _jsx("span", { className: "chat-disclosure-summary", children: summary })] }), open && _jsx("div", { className: "chat-disclosure-body", children: text })] }));
}
/** Collapsed-by-default tool-call disclosure: summary row + expandable details. */
function ToolDisclosure({ tools }) {
    const [open, setOpen] = useState(false);
    const names = [...new Set(tools.map(tool => tool.name))].join(' / ');
    return (_jsxs("div", { className: `chat-disclosure chat-tools${open ? ' chat-disclosure-open' : ''}`, children: [_jsxs("button", { type: "button", className: "chat-disclosure-head", "aria-expanded": open, onClick: () => { setOpen(value => !value); }, children: [_jsx("span", { className: "chat-disclosure-caret", "aria-hidden": true, children: "\u203A" }), _jsx("span", { className: "chat-disclosure-label", children: "\u5DE5\u5177" }), !open && _jsx("span", { className: "chat-disclosure-summary", children: names }), _jsxs("span", { className: "chat-disclosure-count", children: [tools.length, " \u6B21"] })] }), open && (_jsx("div", { className: "chat-disclosure-body chat-tools-body", children: tools.map((tool, index) => (_jsxs("div", { className: "chat-tool-item", children: [_jsx("span", { className: "chat-tool-name", children: tool.name }), tool.arguments !== undefined && _jsx("pre", { className: "chat-tool-args", children: tool.arguments })] }, `${tool.callId}-${index}`))) }))] }));
}
/** Long assistant text collapses behind an explicit expand toggle. */
function CollapsibleText({ text }) {
    const [open, setOpen] = useState(false);
    if (text.length <= LONG_TEXT_LIMIT) {
        return _jsx("span", { className: "chat-msg-text", children: text });
    }
    const shown = open ? text : text.slice(0, LONG_TEXT_PREVIEW);
    return (_jsxs("span", { className: "chat-msg-text", children: [shown, !open ? '…' : '', _jsx("button", { type: "button", className: "chat-msg-toggle", onClick: () => { setOpen(value => !value); }, children: open ? '收起' : `展开全文（${text.length} 字）` })] }));
}
const LONG_TEXT_LIMIT = 1600;
const LONG_TEXT_PREVIEW = 800;
/** Latest non-empty line of a streaming reasoning buffer. */
function lastLine(text) {
    const trimmed = text.trimEnd();
    if (trimmed === '')
        return '';
    const newline = trimmed.lastIndexOf('\n');
    const line = newline === -1 ? trimmed : trimmed.slice(newline + 1);
    return line.trim() === '' ? '' : line;
}
/* ── bottom sheets ───────────────────────────────────────────────────── */
/** Shared bottom-sheet chrome (backdrop + slide-up panel). */
function Sheet({ title, onClose, children }) {
    return (_jsx("div", { className: "sheet-backdrop", onClick: onClose, children: _jsxs("div", { className: "sheet", role: "dialog", "aria-modal": "true", "aria-label": title, onClick: (event) => { event.stopPropagation(); }, children: [_jsx("div", { className: "sheet-handle", "aria-hidden": true }), _jsx("div", { className: "sheet-title", children: title }), _jsx("div", { className: "sheet-body", children: children })] }) }));
}
/** The model + thinking-effort picker (fresh advisory directory per open). */
function ModelSheet({ sessionId, current, onCurrent, onClose }) {
    const [state, setState] = useState({ status: 'loading' });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(undefined);
    const load = useCallback(() => {
        setState({ status: 'loading' });
        void models(sessionId).then(data => { setState({ status: 'ready', data }); }, (reason) => { setState({ status: 'error', message: errorText(reason) }); });
    }, [sessionId]);
    useEffect(() => { load(); }, [load]);
    /** Select model/effort and close on success (one-shot action per sheet). */
    const apply = useCallback((selection) => {
        if (busy)
            return;
        setBusy(true);
        setError(undefined);
        void selectModel(sessionId, selection).then((result) => {
            setBusy(false);
            onCurrent(result.selected);
            onClose();
        }, (reason) => {
            setBusy(false);
            setError(errorText(reason));
        });
    }, [busy, sessionId, onCurrent, onClose]);
    if (state.status === 'loading') {
        return (_jsx(Sheet, { title: "\u6A21\u578B\u4E0E\u601D\u8003\u5F3A\u5EA6", onClose: onClose, children: _jsx("div", { className: "sheet-status", children: "\u6B63\u5728\u52A0\u8F7D\u6A21\u578B\u76EE\u5F55\u2026" }) }));
    }
    if (state.status === 'error') {
        return (_jsx(Sheet, { title: "\u6A21\u578B\u4E0E\u601D\u8003\u5F3A\u5EA6", onClose: onClose, children: _jsxs("div", { className: "sheet-status sheet-status-error", children: [_jsx("span", { children: state.message }), staleHostHint(state.message) !== undefined && _jsx("span", { className: "sheet-hint", children: staleHostHint(state.message) }), _jsx("button", { type: "button", className: "chat-load-older", onClick: load, children: "\u91CD\u8BD5" })] }) }));
    }
    const { data } = state;
    const selected = current ?? data.current;
    const choices = data.groups.flatMap(group => group.models.map(model => ({ group, model })));
    const currentChoice = choices.find(choice => choice.group.id === selected.provider && choice.model.id === selected.model);
    const reasoning = currentChoice?.model.reasoning;
    const effectiveEffort = selected.reasoningEffort ?? reasoning?.defaultEffort;
    const effortChoices = reasoning === undefined
        ? []
        : [
            ...(reasoning.defaultEffort === undefined
                ? [{ key: 'provider-default', effort: undefined, label: '跟随模型默认' }]
                : []),
            ...reasoning.efforts.map(effort => ({
                key: `effort:${effort.id}`,
                effort: effort.id,
                label: effort.name,
                description: effort.description,
            })),
        ];
    return (_jsxs(Sheet, { title: "\u6A21\u578B\u4E0E\u601D\u8003\u5F3A\u5EA6", onClose: onClose, children: [error !== undefined && _jsx("p", { className: "sheet-error", children: error }), error !== undefined && staleHostHint(error) !== undefined && _jsx("p", { className: "sheet-hint", children: staleHostHint(error) }), data.failures.map(failure => (_jsxs("p", { className: "sheet-error", children: [failure.name, ": ", failure.message] }, failure.id))), data.groups.length === 0 && choices.length === 0 && (_jsx("div", { className: "sheet-status", children: "\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B" })), data.groups.map(group => (_jsxs("div", { className: "sheet-section", children: [_jsx("div", { className: "sheet-section-title", children: group.name }), group.models.map(model => {
                        const isSelected = selected.provider === group.id && selected.model === model.id;
                        return (_jsxs("button", { type: "button", className: `sheet-option${isSelected ? ' sheet-option-selected' : ''}`, disabled: busy, onClick: () => {
                                apply({
                                    provider: group.id,
                                    model: model.id,
                                    ...(model.reasoning?.defaultEffort === undefined ? {} : { reasoningEffort: model.reasoning.defaultEffort }),
                                });
                            }, children: [_jsxs("span", { className: "sheet-option-copy", children: [_jsx("span", { className: "sheet-option-title", children: model.name }), model.description !== undefined && _jsx("span", { className: "sheet-option-desc", children: model.description })] }), isSelected && _jsx("span", { className: "sheet-option-check", "aria-hidden": true, children: "\u221A" })] }, model.id));
                    })] }, group.id))), effortChoices.length > 0 && (_jsxs("div", { className: "sheet-section", children: [_jsx("div", { className: "sheet-section-title", children: "\u601D\u8003\u5F3A\u5EA6" }), effortChoices.map(choice => {
                        const isSelected = effectiveEffort === choice.effort;
                        return (_jsxs("button", { type: "button", className: `sheet-option${isSelected ? ' sheet-option-selected' : ''}`, disabled: busy, onClick: () => { apply({ provider: selected.provider, model: selected.model, ...(choice.effort !== undefined ? { reasoningEffort: choice.effort } : {}) }); }, children: [_jsx("span", { className: "sheet-option-copy", children: _jsx("span", { className: "sheet-option-title", children: choice.label }) }), isSelected && _jsx("span", { className: "sheet-option-check", "aria-hidden": true, children: "\u221A" })] }, choice.key));
                    })] }))] }));
}
/** The permission-preset picker; full access needs an explicit confirm. */
function PermissionSheet({ sessionId, value, onChanged, onClose }) {
    const [confirming, setConfirming] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(undefined);
    /** Submit `/permission <value>` as a slash command (mode-agnostic). */
    const submit = useCallback((next) => {
        if (busy)
            return;
        setBusy(true);
        setError(undefined);
        void sendCommand(sessionId, `/permission ${next}`).then(() => {
            setBusy(false);
            setConfirming(null);
            onChanged(next);
            onClose();
        }, (reason) => {
            setBusy(false);
            setConfirming(null);
            setError(errorText(reason));
        });
    }, [busy, sessionId, onChanged, onClose]);
    const choose = (next) => {
        if (next === value.currentValue) {
            onClose();
            return;
        }
        if (next === 'danger-full-access') {
            setConfirming(next);
            return;
        }
        submit(next);
    };
    if (confirming !== null) {
        return (_jsxs(Sheet, { title: "\u786E\u8BA4\u5B8C\u5168\u6743\u9650", onClose: () => { setConfirming(null); }, children: [_jsx("p", { className: "sheet-confirm-desc", children: "\u5F00\u542F\u5B8C\u5168\u6743\u9650\u540E\uFF0C\u8FDC\u7A0B\u4F1A\u8BDD\u53EF\u4EE5\u5728\u5DE5\u4F5C\u533A\u5185\u6267\u884C\u4EFB\u610F\u64CD\u4F5C\uFF08\u5305\u62EC\u8FD0\u884C\u547D\u4EE4\u3001\u4FEE\u6539\u6240\u6709\u6587\u4EF6\u4E0E\u8BBF\u95EE\u51ED\u8BC1\uFF09\u3002 \u4EC5\u5728\u60A8\u4FE1\u4EFB\u5F53\u524D\u8BBE\u5907\u548C\u7F51\u7EDC\u65F6\u5F00\u542F\u3002" }), error !== undefined && _jsx("p", { className: "sheet-error", children: error }), _jsxs("div", { className: "sheet-confirm-actions", children: [_jsx("button", { type: "button", className: "mobile-button", disabled: busy, onClick: () => { setConfirming(null); }, children: "\u53D6\u6D88" }), _jsx("button", { type: "button", className: "sheet-confirm-danger", disabled: busy, onClick: () => { submit(confirming); }, children: busy ? '提交中…' : '确认开启' })] })] }));
    }
    return (_jsxs(Sheet, { title: "\u6743\u9650", onClose: onClose, children: [error !== undefined && _jsx("p", { className: "sheet-error", children: error }), value.options.map(option => {
                const isSelected = option.value === value.currentValue;
                return (_jsxs("button", { type: "button", className: `sheet-option${isSelected ? ' sheet-option-selected' : ''}`, disabled: busy, onClick: () => { choose(option.value); }, children: [_jsxs("span", { className: "sheet-option-copy", children: [_jsx("span", { className: "sheet-option-title", children: option.name }), option.description !== undefined && _jsx("span", { className: "sheet-option-desc", children: option.description })] }), isSelected && _jsx("span", { className: "sheet-option-check", "aria-hidden": true, children: "\u221A" })] }, option.value));
            })] }));
}
