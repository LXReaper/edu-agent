export const CssVariableNames = {
    // color
    backgroundColor: '--background-color',
    foregroundColor: '--foreground-color',
    borderColor: '--border-color',

    footerBackgroundColor: '--footer-background-color',
    footerForegroundColor: '--footer-foreground-color',

    leftAsideBackgroundColor: '--left-aside-background-color',
    leftAsideForegroundColor: '--left-aside-foreground-color',

    foregroundHoverColor: '--foreground-hover-color',

    okButtonColor: '--ok-button-color',
    technologyButtonColor: '--technology-button-color',
    buttonHoverColor: '--button-hover-color',

    cardForegroundColor: '--card-foreground-color',

    inputBorderColor: '--input-border-color',

    // dashboard color
    dashboardBackgroundColor: '--dashboard-background-color',
    dashboardForegroundColor: '--dashboard-foreground-color',
    dashBoardTextBoardColor: '--dashboard-text-board-color',

    dashBoardNormalButtonColor: '--dashboard-normal-button-color',
    dashBoardNormalButtonHoverColor: '--dashboard-normal-button-hover-color',
    dashBoardOKButtonColor: '--dashboard-ok-button-color',
    dashBoardOKButtonHoverColor: '--dashboard-ok-button-hover-color',
    dashBoardOKButtonTextColor: '--dashboard-ok-button-text-color',

    // size
    dashboardLeftAsideWidth: '--dashboard-left-aside-width',
}

export type CssVariableName =
    | (typeof CssVariableNames)[keyof typeof CssVariableNames]
    | (string & {});

export const themeConfig = {
    currentTheme: 'dark',
    systemSuffix: ':system',
    userSuffix: ':user',
    themes: {
        light: {
            id: 'light',
            name: '亮色主题',
            variables: {
                [CssVariableNames.backgroundColor]: 'oklch(97.41% 0 129.63)',
                [CssVariableNames.foregroundColor]: 'oklch(22.77% .0034 67.65)',
                [CssVariableNames.borderColor]: '#333',
                [CssVariableNames.leftAsideBackgroundColor]: '#f6f7f9',
                [CssVariableNames.leftAsideForegroundColor]: '#000',
                [CssVariableNames.foregroundHoverColor]: '#5e5e5e',
                [CssVariableNames.okButtonColor]: '#1e1e1e',
                [CssVariableNames.buttonHoverColor]: '#e1e2e3',
                [CssVariableNames.footerBackgroundColor]: '#242933',
                [CssVariableNames.foregroundHoverColor]: '#fff',

                [CssVariableNames.dashboardBackgroundColor]: '#fdf9f1',
                [CssVariableNames.dashboardForegroundColor]: '#1e1e1e',
                [CssVariableNames.dashBoardTextBoardColor]: '#fff',

                [CssVariableNames.dashBoardNormalButtonColor]: '#fff',
                [CssVariableNames.dashBoardNormalButtonHoverColor]: '#fdf9f1',
                [CssVariableNames.dashBoardOKButtonColor]: '#2e2e2e',
                [CssVariableNames.dashBoardOKButtonHoverColor]: '#121212',
                [CssVariableNames.dashBoardOKButtonTextColor]: '#fff',

                [CssVariableNames.dashboardLeftAsideWidth]: '308px',
            },
        },
        dark: {
            id: 'dark',
            name: '暗色主题',
            variables: {
                [CssVariableNames.backgroundColor]: 'oklch(18.5% .005 285.823)',
                [CssVariableNames.foregroundColor]: 'oklch(88.5% 0 0)',
                [CssVariableNames.borderColor]: '#333',
                [CssVariableNames.leftAsideBackgroundColor]: 'oklch(15.5% .005 285.823)',
                [CssVariableNames.leftAsideForegroundColor]: '#fff',
                [CssVariableNames.foregroundHoverColor]: '#fff',
                [CssVariableNames.okButtonColor]: '#ddd',
                [CssVariableNames.buttonHoverColor]: '#1e1e21',
                [CssVariableNames.footerBackgroundColor]: '#191919',
                [CssVariableNames.foregroundHoverColor]: '#000',

                [CssVariableNames.dashboardBackgroundColor]: '#1d1d1d',
                [CssVariableNames.dashboardForegroundColor]: '#ccc',
                [CssVariableNames.dashBoardTextBoardColor]: '#2f2f2f',

                [CssVariableNames.dashBoardNormalButtonColor]: '#2f2f2f',
                [CssVariableNames.dashBoardNormalButtonHoverColor]: '#2a2a2a',
                [CssVariableNames.dashBoardOKButtonColor]: '#121212',
                [CssVariableNames.dashBoardOKButtonHoverColor]: '#000',
                [CssVariableNames.dashBoardOKButtonTextColor]: '#fff',

                [CssVariableNames.dashboardLeftAsideWidth]: '308px',
            },
        },
    }
}

export const LocalStorageKeys = {
    currentTheme: "themeConfig-currentTheme",
}
