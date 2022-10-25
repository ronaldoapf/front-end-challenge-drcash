import {
  useEffect, useState, useCallback, Fragment,
} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { Form, Formik } from 'formik';

import {
  Card,
  Grid,
  Button,
  Divider,
  Container,
  TextField,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from '@mui/material';

import { diff } from 'deep-object-diff';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import Page from '../../../components/Page';
import Spinner from '../../../components/Spinner';

import { schema } from '../validation';

const SpecifiClinic = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});

  const fetchData = useCallback(async () => {
    const response = await api.get(`/clinicas/${params.id}`);
    setData(response.data.clinicas);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, [200]);
  }, []);

  const handleSubmit = async (values) => {
    try {
      const hasDiff = diff(data, values);
      const isEmpty = Object.keys(hasDiff).length;

      if (isEmpty === 0) {
        toast.info('Nada foi alterado no formulário', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        return;
      }

      await api.patch(`/clinicas/${params.id}`, {
        ...hasDiff,
      });
      toast.success('Alteração realizada com sucesso', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate('/clinicas');
    } catch (e) {
      toast.error('Não foi possível realizar alteração', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const renderPage = () => {
    if (Object.keys(data).length === 0) return <Spinner />;

    return (
      <Container maxWidth={false} style={{ paddingTop: '20px' }}>
        <Card>
          <CardHeader title="Edição de clínicas" />
          <Divider />
          <CardContent>
            <Formik
              initialValues={data}
              onSubmit={handleSubmit}
              validationSchema={schema}
            >
              {({
                values,
                errors,
                touched,
                setValues,
                handleBlur,
                handleChange,
              }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="text"
                        size="small"
                        name="nome"
                        label="Nome"
                        value={values.nome}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        helperText={touched?.nome && errors?.nome}
                        error={touched?.nome && Boolean(errors?.nome)}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="text"
                        size="small"
                        name="cnpj"
                        label="CNPJ"
                        onBlur={handleBlur}
                        value={values.cnpj}
                        onChange={handleChange}
                        helperText={touched?.cnpj && errors?.cnpj}
                        error={touched?.cnpj && Boolean(errors?.cnpj)}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="email"
                        size="small"
                        name="email"
                        label="E-mail"
                        onBlur={handleBlur}
                        value={values.email}
                        onChange={handleChange}
                        helperText={touched?.email && errors?.email}
                        error={touched?.email && Boolean(errors?.email)}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="text"
                        size="small"
                        name="address"
                        label="Endereço"
                        onBlur={handleBlur}
                        value={values.address}
                        onChange={handleChange}
                        helperText={touched?.address && errors?.address}
                        error={touched?.address && Boolean(errors?.address)}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="tel"
                        name="fone"
                        size="small"
                        label="Telefone"
                        value={values.fone}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        helperText={touched?.fone && errors?.fone}
                        error={touched?.fone && Boolean(errors?.fone)}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      style={{
                        gap: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Link to="/clinicas">
                        <Button
                          size="small"
                          color="secondary"
                          variant="outlined"
                        >
                          Cancelar
                        </Button>
                      </Link>
                      <Button
                        size="small"
                        type="submit"
                        variant="contained"
                      >
                        Concluir
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </Container>
    );
  };

  return (
    <Page title="Edição :: iClinic">
      {renderPage()}
    </Page>
  );
};

export default SpecifiClinic;
