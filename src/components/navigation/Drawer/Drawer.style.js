import { makeStyles, fade } from '@material-ui/core/styles';

export const useDrawerStyles = makeStyles(theme => ({
    drawerPaper: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },

    listItem: {
        padding: theme.spacing(1.25, 2),
        color: theme.palette.common.white,
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
        },
    },

    closeButton: {
        color: 'inherit',
        padding: theme.spacing(2),
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
        },
    },
}));