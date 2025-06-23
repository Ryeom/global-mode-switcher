# Obsidian Global Mode Switcher

![Obsidian Global Mode Switcher Icon Example](https://img.shields.io/badge/Status-Stable-brightgreen)
Obsidian Global Mode Switcher는 Obsidian의 모든 열린 마크다운 탭에 대한 읽기/편집 모드를 전역적으로 제어할 수 있도록 도와주는 플러그인입니다. 한 번의 클릭으로 모든 문서의 보기 방식을 전환하거나, 특정 모드를 강제하여 작업 흐름을 일관되게 유지할 수 있습니다.

## ✨ 주요 기능

* **전역 모드 제어**:
    * **기본 모드 (Default)**: 각 탭의 모드를 사용자가 개별적으로 제어할 수 있습니다.
    * **읽기 전용 강제 (Force Read-only)**: 모든 열린 마크다운 탭을 읽기 모드로 고정합니다.
    * **편집 가능 강제 (Force Editable)**: 모든 열린 마크다운 탭을 편집 모드로 고정합니다.
* **리본 아이콘**: 왼쪽 리본에 모드 전환 아이콘이 생성되며, 클릭할 때마다 모드가 순환하고 아이콘도 현재 모드에 따라 변경됩니다.
* **동적 툴팁**: 리본 아이콘에 마우스를 올리면 현재 적용된 전역 모드를 표시하는 툴팁이 나타납니다. (한국어/영어 지원)
* **개별 탭 버튼 비활성화**: 전역 모드가 활성화되었을 때 (읽기/편집 강제 모드), 개별 탭 상단의 읽기/편집 모드 전환 버튼이 비활성화되어 전역 설정과의 충돌을 방지합니다.
* **모바일 환경 지원**:
    * 플러그인 시작 시 모바일 환경에서는 설정에 따라 모든 탭이 기본적으로 읽기 모드로 고정될 수 있습니다.
    * 리본 아이콘은 모바일에서도 정상적으로 작동합니다.
* **명령 팔레트 지원**: 명령 팔레트(`Ctrl/Cmd + P`)를 통해 특정 모드를 바로 설정하거나, 모드를 순환할 수 있습니다.
* **설정 가능한 알림**: 모드 변경 시 화면 상단에 일시적인 알림 메시지를 표시할지 여부를 설정할 수 있습니다.

## 🚀 설치 방법

### 수동 설치 (Manual Installation)

1.  이 GitHub 저장소를 `Code` 버튼을 클릭하여 `.zip` 파일로 다운로드합니다.
2.  다운로드한 파일을 압축 해제합니다.
3.  압축 해제된 폴더를 Obsidian Vault의 `.obsidian/plugins/` 경로 아래에 복사합니다. (예: `your-vault/.obsidian/plugins/global-mode-switcher`)
    * `.obsidian` 폴더는 숨김 폴더일 수 있습니다.
4.  Obsidian을 재시작합니다.
5.  Obsidian 설정 (`Settings`) > `Community plugins`로 이동하여 "Global Mode Switcher"를 찾아서 활성화합니다.

## 💡 사용 방법

1.  **리본 아이콘 사용**:
    * Obsidian 왼쪽 리본에 새로 생성된 아이콘(기본적으로 눈 모양)을 클릭하여 모드를 순환합니다.
    * 아이콘은 `눈` (기본), `책` (읽기 전용), `연필` (편집 가능) 모양으로 변경됩니다.
    * 아이콘에 마우스를 올리면 현재 적용된 모드를 툴팁으로 확인할 수 있습니다.
    * **팁**: 리본 아이콘은 드래그하여 원하는 위치로 옮길 수 있습니다.
2.  **명령 팔레트 사용**:
    * `Ctrl/Cmd + P`를 눌러 명령 팔레트를 엽니다.
    * "Global Mode"를 검색하면 다음과 같은 명령어를 사용할 수 있습니다:
        * `Global Mode: Set Global Mode: User Control (Default)`
        * `Global Mode: Set Global Mode: Force Read-only`
        * `Global Mode: Set Global Mode: Force Editable`
        * `Global Mode: Cycle Global Mode`

## ⚙️ 플러그인 설정

Obsidian 설정 (`Settings`) > `Global Mode Switcher` 탭에서 다음 옵션을 설정할 수 있습니다.

* **Show Reading Mode Icon**: 리본에 모드 제어 아이콘을 표시할지 여부를 토글합니다. (기본값: 켜짐)
* **Initial Mobile Mode**: 모바일 Obsidian 앱 시작 시 기본적으로 적용될 전역 모드를 설정합니다. (기본값: Force Read-only)
* **Tooltip Language**: 리본 아이콘의 툴팁 언어를 선택합니다. (기본값: English)
* **Show Mode Change Notices**: 전역 모드가 변경될 때 화면 상단에 알림 메시지를 표시할지 여부를 설정합니다. (기본값: 켜짐)

## ⚠️ 알려진 제한 사항

* **리본 아이콘 위치**: 플러그인은 리본 아이콘의 특정 위치를 프로그래밍 방식으로 제어할 수 없습니다. 아이콘은 수동으로 드래그하여 재배치할 수 있습니다.
* **상태 표시줄 (Status Bar) 아이콘**: 상태 표시줄에 아이콘을 추가할 수 있지만, 이 위치의 아이콘은 모바일 앱에서는 표시되지 않습니다. 따라서 플러그인의 주요 기능 아이콘은 리본에만 제공됩니다.

## 🤝 기여 및 지원

버그를 발견하거나 새로운 기능 아이디어가 있다면, GitHub 저장소의 [Issues](링크 추가 예정)에 보고해주세요.

---

### 저작권 (License)

[MIT License](LICENSE.md)

---