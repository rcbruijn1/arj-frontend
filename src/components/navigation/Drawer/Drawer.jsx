import React, { Fragment, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

// Icons
import { AddOutlined, Assignment, Close, ExitToApp, People, Security, TodayOutlined } from '@material-ui/icons';

// Core
import { 
    Avatar,
    Box, 
    Button, 
    Dialog, 
    DialogContent, 
    Divider, 
    Drawer as MuiDrawer, 
    IconButton, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    Typography
} from '@material-ui/core';
import { SelectField, TextField } from '../../fields';
import { UserContext } from '../../../providers/User.provider';

// GraphQL
import { GET_USERS } from '../../../graphql';

// Routing
import { 
    ADMIN_PATH, 
    CLIENT_LIST_PATH, 
    CREATE_DOSSIER_PATH, 
    DOSSIER_LIST_PATH, 
    OVERVIEW_PATH,
} from '../../../routes/paths';

// Styles
import { useDrawerStyles } from './Drawer.style';

const GetUsers = () => {
    const { loading, data } = useQuery(GET_USERS, {
      fetchPolicy: 'cache-and-network',
    });
  
    if (loading) return { usersLoading: true, users: [] };
    return (data && { usersLoading: false, users: data.getUsers }) || [];
};

const Drawer = ({ isOpen, handleClose}) => {
  const classes = useDrawerStyles();
  const history = useHistory();
  const { control, handleSubmit, setValue} = useForm();
  const { enqueueSnackbar } = useSnackbar();

  const { setUser, userState } = useContext(UserContext);
  const { loading, users} = GetUsers();

  const [openDialog, setDialogOpen] = useState(false);

  useEffect(() => {
      setValue('user_select', userState);
  }, []);

  const onAdminClick = () => {
      if (!localStorage.getItem('user') && !localStorage.getItem('password')) {
          setDialogOpen(true)
      } else {
        history.push(ADMIN_PATH);
      }
  }

  const logout = () => {
    setUser(null);
    history.push('/')
    enqueueSnackbar(`Succesvol uitgelogd!`, { variant: 'success' });
  };

  const handleFormSubmit = async values => {
    if (values.user === 'admin' && values.password === '1234') {
        localStorage.setItem('user', values.user);
        localStorage.setItem('password', values.password);
        history.push(ADMIN_PATH);
        setDialogOpen(false);
    } else {
        enqueueSnackbar(`Gebruikersgegevens zijn verkeerd of u heeft geen toegang`, { variant: 'error' });
    }
  };

  if (loading) return 'Loading';

  return (
    <Fragment>
        <MuiDrawer anchor="right" open={isOpen} onClose={handleClose} classes={{ paper: classes.drawerPaper }}>
            <div>
                <IconButton onClick={handleClose} className={classes.closeButton}>
                    <Close />
                </IconButton>
            </div>

            <Box mx={2} pt={2} pb={1}>
                <Divider />
            </Box>

            <Box display="flex" flexDirection="column">
                <ListItem className={classes.listItem} style={{ pointerEvents: 'none' }} button>
                    <Avatar alt={userState.name} style={{ marginRight: 16 }}>
                        {userState.name.charAt(0)}
                    </Avatar>
                    <ListItemText primary={userState.name} />
                </ListItem>
            </Box>

            <Box mx={2} py={2}>
                <Divider />
            </Box>

            <Box display="flex" flexDirection="column" justifyContent="space-between" minWidth={300}>
                <List>
                    <ListItem button className={classes.listItem} onClick={() => history.push(OVERVIEW_PATH)}>
                        <ListItemIcon color="inherit">
                            <TodayOutlined />
                        </ListItemIcon>
                        <ListItemText primary="Dagoverzicht" />
                    </ListItem>
                    <ListItem 
                        button 
                        className={classes.listItem} 
                        onClick={() => history.push(CREATE_DOSSIER_PATH)}
                        disabled={!userState}
                    >
                        <ListItemIcon color="inherit">
                            <AddOutlined />
                        </ListItemIcon>
                        <ListItemText primary="Nieuw Observatiedossier" />
                    </ListItem>
                    <ListItem button className={classes.listItem} onClick={() => history.push(CLIENT_LIST_PATH)}>
                        <ListItemIcon>
                            <People />
                        </ListItemIcon>
                        <ListItemText primary="Cliëntenoverzicht" />
                    </ListItem>
                    <ListItem button className={classes.listItem} onClick={() => history.push(DOSSIER_LIST_PATH)}>
                        <ListItemIcon>
                            <Assignment />
                        </ListItemIcon>
                        <ListItemText primary="Dossieroverzicht" />
                    </ListItem>
                </List>

                <Box mx={2} py={2}>
                    <Divider />
                </Box>
                {history.location.pathname !== '/admin' && (
                    <List disablePadding>
                        <ListItem button className={classes.listItem} onClick={onAdminClick}>
                            <ListItemIcon>
                                <Security />
                            </ListItemIcon>
                            <ListItemText primary="Administratie" />
                        </ListItem>
                    </List>
                )}
            </Box>

            <Box mx={2} py={2}>
                <Divider />
            </Box>

            <ListItem button className={classes.listItem} onClick={() => logout()}>
                <ListItemIcon>
                    <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Uitloggen" />
            </ListItem>
        </MuiDrawer>

        <Dialog open={openDialog}>
            <DialogContent>
                <Typography color="primary" gutterBottom>
                    Authenticatie
                </Typography>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Controller
                        control={control}
                        as={TextField} 
                        label="Gebruiker"
                        name="user"
                        fullWidth
                    />

                    <Controller
                        control={control}
                        as={TextField} 
                        label="Wachtwoord"
                        name="password"
                        fullWidth
                    />
                    <Box display="flex" justifyContent="space-between" py={2}>
                        <Button variant="contained" color="primary" type="submit">
                            Bevestigen
                        </Button>
                        <Button variant="outlined" color="primary" onClick={() => setDialogOpen(false)}>
                            Sluiten
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    </Fragment>
  )
};

Drawer.propTypes = {
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
};

export default Drawer;
