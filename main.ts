// main.ts
import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import ReadingModeController, { ReadingModeState } from './read-mode';

interface GlobalModeSwitcherSettings {
	showReadingModeIcon: boolean;
	initialMobileMode: ReadingModeState;
	language: 'en' | 'ko';
	showNotices: boolean;
}

const DEFAULT_SETTINGS: GlobalModeSwitcherSettings = {
	showReadingModeIcon: true,
	initialMobileMode: ReadingModeState.FORCE_READ,
	language: 'en',
	showNotices: true,
}

export default class GlobalModeSwitcherPlugin extends Plugin {
	settings: GlobalModeSwitcherSettings;
	readingModeController: ReadingModeController;

	async onload() {
		await this.loadSettings();

		this.readingModeController = new ReadingModeController(this);
		this.readingModeController.init();

		if ((this.app as any).isMobile) {
			this.readingModeController.state = this.settings.initialMobileMode;
			this.readingModeController.applyModeToAllLeaves();
			this.readingModeController.updateIcon();
			this.readingModeController.updateRibbonIcons();
		}

		// 개별 모드 설정 명령
		this.addCommand({
			id: 'set-global-mode-default',
			name: 'Set Global Mode: User Control (Default)',
			callback: () => {
				this.readingModeController.setGlobalMode(ReadingModeState.DEFAULT);
			}
		});

		this.addCommand({
			id: 'set-global-mode-read',
			name: 'Set Global Mode: Force Read-only',
			callback: () => {
				this.readingModeController.setGlobalMode(ReadingModeState.FORCE_READ);
			}
		});

		this.addCommand({
			id: 'set-global-mode-edit',
			name: 'Set Global Mode: Force Editable',
			callback: () => {
				this.readingModeController.setGlobalMode(ReadingModeState.FORCE_EDIT);
			}
		});

		// <-- 새로운 순환 명령 추가 시작 -->
		this.addCommand({
			id: 'cycle-global-mode',
			name: 'Cycle Global Mode', // 순환 명령 이름
			callback: () => {
				this.readingModeController.cycleMode(); // cycleMode 함수 호출
			}
		});
		// <-- 새로운 순환 명령 추가 끝 -->


		this.addSettingTab(new GlobalModeSwitcherSettingTab(this.app, this));
	}

	onunload() {
		this.readingModeController.destroy();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class GlobalModeSwitcherSettingTab extends PluginSettingTab {
	plugin: GlobalModeSwitcherPlugin;

	constructor(app: App, plugin: GlobalModeSwitcherPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Show Reading Mode Icon')
			.setDesc('Toggle the visibility of the reading mode control icon in the left ribbon.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showReadingModeIcon)
				.onChange(async (value) => {
					this.plugin.settings.showReadingModeIcon = value;
					await this.plugin.saveSettings();
					this.plugin.readingModeController.init();
				}));

		new Setting(containerEl)
			.setName('Initial Mobile Mode')
			.setDesc('Set the default mode when Obsidian starts on mobile devices.')
			.addDropdown(dropdown => dropdown
				.addOption(ReadingModeState.FORCE_READ, 'Force Read Mode')
				.addOption(ReadingModeState.FORCE_EDIT, 'Force Edit Mode')
				.setValue(this.plugin.settings.initialMobileMode)
				.onChange(async (value: ReadingModeState) => {
					this.plugin.settings.initialMobileMode = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Tooltip Language')
			.setDesc('Choose the language for the ribbon icon tooltip.')
			.addDropdown(dropdown => dropdown
				.addOption('en', 'English')
				.addOption('ko', '한국어')
				.setValue(this.plugin.settings.language)
				.onChange(async (value: 'en' | 'ko') => {
					this.plugin.settings.language = value;
					await this.plugin.saveSettings();
					this.plugin.readingModeController.updateIcon();
				}));

		new Setting(containerEl)
			.setName('Show Mode Change Notices')
			.setDesc('Display a temporary notice when the global mode is changed.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showNotices)
				.onChange(async (value) => {
					this.plugin.settings.showNotices = value;
					await this.plugin.saveSettings();
				}));
	}
}