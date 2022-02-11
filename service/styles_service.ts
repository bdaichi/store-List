import { createTheme } from "@material-ui/core";

export const appName = "StoreList";
export const primaryColor = '#00a6af';
export const secondaryColor = '#4caf50';

export const theme = createTheme({
    palette: {
        primary: {
            main: primaryColor,
            contrastText: '#ffffff',
        },
        secondary: {
            main: secondaryColor,
            contrastText: '#4caf50'
        }
    },
});