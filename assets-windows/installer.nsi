!include "MUI2.nsh"
!define APP_NAME "Backline"

Name "Backline"
BrandingText "Akario Backline"

# set the icon
!define MUI_ICON "icon.ico"

# define the resulting installer's name:
OutFile "../dist/BacklineInstall.exe"

# set the installation directory
InstallDir "$PROGRAMFILES\Backline\"

# app dialogs
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES

!define MUI_FINISHPAGE_RUN_TEXT "Start Backline"
!define MUI_FINISHPAGE_RUN "$INSTDIR\Backline.exe"

!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "English"

# default section start
Section

  # delete the installed files
  RMDir /r $INSTDIR

  # define the path to which the installer should install
  SetOutPath $INSTDIR

  File "icon.ico"

  # specify the files to go in the output path
  File /r ..\build\Backline\win32\*

  # create the uninstaller
  WriteUninstaller "$INSTDIR\Uninstall Backline.exe"

  # create shortcuts in the start menu and on the desktop
  CreateShortCut "$SMPROGRAMS\Backline.lnk" "$INSTDIR\Backline.exe"
  CreateShortCut "$SMPROGRAMS\Uninstall Backline.lnk" "$INSTDIR\Uninstall Backline.exe"
  CreateShortCut "$DESKTOP\Backline.lnk" "$INSTDIR\Backline.exe"

  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" \
                   "DisplayName" "${APP_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" \
                   "UninstallString" "$INSTDIR\Uninstall ${APP_NAME}.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" \
                   "DisplayIcon" "$INSTDIR\icon.ico"
SectionEnd

# create a section to define what the uninstaller does
Section "Uninstall"

  SetShellVarContext all

  # delete the installed files
  RMDir /r $INSTDIR

  # delete the shortcuts
  Delete "$SMPROGRAMS\Backline.lnk"
  Delete "$SMPROGRAMS\Uninstall Backline.lnk"
  Delete "$DESKTOP\Backline.lnk"

  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"

SectionEnd
