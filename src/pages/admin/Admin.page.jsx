import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';

// Icons
import { ExpandMoreOutlined } from '@material-ui/icons';

// Core
import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, Divider, Typography } from '@material-ui/core';
import { ClientForm, UserForm } from '../../components/forms';
import { Main } from '../../components/layout';
import { GET_CLIENTS, GET_USERS } from '../../graphql';

// Routing
import { OVERVIEW_PATH } from '../../routes/paths';

const GetClients = () => {
    const { loading, data } = useQuery(GET_CLIENTS, {
      fetchPolicy: 'cache-and-network',
    });
  
    if (loading) return { clientsLoading: true, clients: [] };
    return (data && { clientsLoading: false, clients: data.getClients }) || [];
};

const GetUsers = () => {
    const { loading, data } = useQuery(GET_USERS, {
      fetchPolicy: 'cache-and-network',
    });
  
    if (loading) return { usersLoading: true, users: [] };
    return (data && { usersLoading: false, users: data.getUsers }) || [];
};

const AdminPage = () => {
    const { clients, clientsLoading } = GetClients();
    const { users, usersLoading } = GetUsers();
    const history = useHistory();

    useEffect(() => {
        let user = {
            name: localStorage.getItem('user'),
            password: localStorage.getItem('password')
        };

        if (user.name !== 'admin' || user.password !== '1234') {
            history.push(OVERVIEW_PATH);
        }
    })

    if (clientsLoading || usersLoading) return <Box display="flex" justifyContent="center" alignItems="center" height="100%" ><CircularProgress color="secondary" /></Box>;

    return (
        <Main>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreOutlined color="primary" />}
                >
                    <Typography color="primary">
                        Client aanmaken
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ClientForm />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreOutlined color="primary" />}
                >
                    <Typography color="primary">
                        Gebruiker aanmaken
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <UserForm />
                </AccordionDetails>
            </Accordion>

            <Box mt={2}>
                <Typography variant="h6" color="primary" gutterBottom>
                    Cliënten
                </Typography>
                <Divider />
                {clients.map(client => (
                    <Box key={client.id} my={1.5}>
                        <Typography color="primary">
                          {client.name}
                        </Typography>
                        <Typography variant="body2">
                          {client.email}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Box mt={2}>
                <Typography variant="h6" color="primary" gutterBottom>
                    Gebruikers
                </Typography>
                <Divider />
                {users.map(user => (
                    <Box key={user.id} my={1.5}>
                        <Typography color="primary">
                          {user.name}
                        </Typography>
                        <Typography variant="body2">
                          {user.email}
                        </Typography>
                        <Typography variant="body2">
                          {user.job_title}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Main>
    );
};

export default AdminPage;