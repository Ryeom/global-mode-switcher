// ReadingModeController.ts
import { Plugin, WorkspaceLeaf, setIcon, MarkdownView, Notice } from "obsidian";
import type GlobalModeSwitcherPlugin from "./main";

export enum ReadingModeState {
    DEFAULT = "default",
    FORCE_READ = "read",
    FORCE_EDIT = "edit",
}

const localizedStrings = {
    en: {
        tooltips: {
            [ReadingModeState.DEFAULT]: "Reading Mode Toggle (Default - User Control)",
            [ReadingModeState.FORCE_READ]: "Current Mode: Read-only",
            [ReadingModeState.FORCE_EDIT]: "Current Mode: Editable",
        },
        notices: {
            [ReadingModeState.DEFAULT]: "Global Mode: User Control",
            [ReadingModeState.FORCE_READ]: "Global Mode: Force Read-only",
            [ReadingModeState.FORCE_EDIT]: "Global Mode: Force Editable",
        }
    },
    ko: {
        tooltips: {
            [ReadingModeState.DEFAULT]: "읽기/편집 모드 전환 (기본 - 사용자 제어)",
            [ReadingModeState.FORCE_READ]: "현재 모드: 읽기 전용",
            [ReadingModeState.FORCE_EDIT]: "현재 모드: 편집 가능",
        },
        notices: {
            [ReadingModeState.DEFAULT]: "전역 모드: 사용자 제어",
            [ReadingModeState.FORCE_READ]: "전역 모드: 읽기 전용 강제",
            [ReadingModeState.FORCE_EDIT]: "전역 모드: 편집 가능 강제",
        }
    }
};

export default class ReadingModeController {
    plugin: GlobalModeSwitcherPlugin;
    state: ReadingModeState = ReadingModeState.DEFAULT;
    iconEl: HTMLElement | null = null;

    constructor(p: GlobalModeSwitcherPlugin) {
        this.plugin = p;

        this.plugin.registerEvent(
            this.plugin.app.workspace.on("file-open", () => {
                this.applyModeToAllLeaves();
            })
        );

        this.plugin.registerEvent(
            this.plugin.app.workspace.on("active-leaf-change", (leaf) => {
                if (!leaf || !(leaf.view instanceof MarkdownView)) {
                    return;
                }

                const view = leaf.view as MarkdownView;
                const currentMode = view.getMode();

                if (this.state !== ReadingModeState.DEFAULT) {
                    const expectedMode = this.state === ReadingModeState.FORCE_EDIT ? "source" : "preview";

                    if (currentMode !== expectedMode) {
                        this.applyModeToLeaf(leaf);
                    }
                }
                this.updateRibbonIcons();
            })
        );
    }

    init() {
        if (!this.plugin.settings.showReadingModeIcon) {
            this.removeReadingModeIcon();
            this.updateRibbonIcons();
            return;
        }

        if (!this.iconEl) {
            const initialTooltip = localizedStrings[this.plugin.settings.language].tooltips[this.state];
            this.iconEl = this.plugin.addRibbonIcon("eye", initialTooltip, () => {
                this.cycleMode();
            });
        }

        this.updateIcon();
        this.updateRibbonIcons();
    }

    removeReadingModeIcon() {
        if (this.iconEl) {
            this.iconEl.remove();
            this.iconEl = null;
        }
    }

    /**
     * 전역 모드를 설정하고 관련된 모든 UI 업데이트 및 알림을 처리합니다.
     * @param newState 설정할 새로운 ReadingModeState
     */
    setGlobalMode(newState: ReadingModeState) { // <-- 새로운 함수 추가
        if (this.state === newState) {
            return;
        }

        this.state = newState;

        this.updateIcon(); // 아이콘 및 툴팁 업데이트
        this.applyModeToAllLeaves(); // 모든 탭에 모드 적용
        this.updateRibbonIcons(); // CSS 클래스 업데이트

        if (this.plugin.settings.showNotices) {
            const currentLanguage = this.plugin.settings.language;
            const noticeMessage = localizedStrings[currentLanguage].notices[this.state];
            new Notice(noticeMessage);
        }
    }

    /** 모드 변경 순환: default -> read -> edit -> default */
    cycleMode() {
        const order = [
            ReadingModeState.DEFAULT,
            ReadingModeState.FORCE_READ,
            ReadingModeState.FORCE_EDIT,
        ];
        const currentIndex = order.indexOf(this.state);
        const nextIndex = (currentIndex + 1) % order.length;
        const newState = order[nextIndex];

        this.setGlobalMode(newState); // <-- 새로운 함수 호출
    }

    /** 현재 열린 모든 파일에 대해 모드 적용 */
    applyModeToAllLeaves() {
        const leaves = this.plugin.app.workspace.getLeavesOfType("markdown");
        for (const leaf of leaves) {
            this.applyModeToLeaf(leaf);
        }
    }

    /** 개별 leaf에 대해 모드 적용 */
    applyModeToLeaf(leaf: WorkspaceLeaf) {
        console.log("[GlobalModeSwitcher] applyModeToLeaf() called for leaf:", leaf);
        if (!(leaf.view instanceof MarkdownView)) {
            console.log("[GlobalModeSwitcher] applyModeToLeaf: View is not MarkdownView. Skipping.");
            return;
        }

        const view = leaf.view as MarkdownView;
        const targetMode = this.state === ReadingModeState.FORCE_EDIT ? "source" :
            this.state === ReadingModeState.FORCE_READ ? "preview" :
                null;

        if (targetMode) {
            if (view.getMode() !== targetMode) {
                leaf.setViewState({
                    ...leaf.getViewState(),
                    state: { ...leaf.getViewState().state, mode: targetMode },
                }, { focus: false });
            }
        }
    }

    /** 상태에 따라 아이콘 변경 및 툴팁 업데이트 */
    updateIcon() {
        if (!this.iconEl) return;

        const iconMap: Record<ReadingModeState, string> = {
            [ReadingModeState.DEFAULT]: "eye",
            [ReadingModeState.FORCE_READ]: "book-open",
            [ReadingModeState.FORCE_EDIT]: "pencil",
        };

        const currentLanguage = this.plugin.settings.language;
        const tooltipText = localizedStrings[currentLanguage].tooltips[this.state];


        const iconName = iconMap[this.state];
        setIcon(this.iconEl, iconName);

        this.iconEl.setAttribute('aria-label', tooltipText);
    }

    updateRibbonIcons() {
        setTimeout(() => {
            if (this.state !== ReadingModeState.DEFAULT) {
                document.body.classList.add('global-mode-active');
            } else {
                document.body.classList.remove('global-mode-active');
            }
        }, 0);
    }

    destroy() {
        this.removeReadingModeIcon();
        document.body.classList.remove('global-mode-active');
    }
}