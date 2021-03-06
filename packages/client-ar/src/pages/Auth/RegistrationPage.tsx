import React, {useContext} from "react";
import {
    Button,
    CardContent,
    FormControl,
    Typography
} from "@material-ui/core";
import {Link} from "react-router-dom";
import {useAuthStyles, AuthPageSplash, AuthContainerStyles, AuthCard} from "./SharedAuth";
import AddressInput from "components/shared/AddressInput";
import {Formik, Form, Field} from "formik";
import {CheckboxWithLabel} from "formik-material-ui";
import * as Yup from "yup";
import arAxios from "utils/axiosHelper";
import {GlobalContext} from "globalContext";
import {FormikTextField} from "../../components/shared/FormikTextField";
import TermsAndConditions from "../TermsAndConditions";
import {useSnackbar} from "notistack";

const initialValues = {
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    email: "",
    password: "",
    passwordConfirm: "",
    acceptTermsConditions: false
};

const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    email: Yup.string()
        .required("Required")
        .email("Please Enter A Valid Email"),
    password: Yup.string()
        .required("Required")
        .min(6, "Password must be at least 6 characters")
        .max(30, "Password must be under 30 characters"),
    passwordConfirm: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "Passwords must match"
    ),
    acceptTermsConditions: Yup.boolean().oneOf(
        [true],
        "Please Review Terms and Conditions"
    )
});

function RegistrationPage(props: any) {
    const classes = useAuthStyles();
    const {setState} = useContext(GlobalContext);
    const {enqueueSnackbar} = useSnackbar();
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };

    async function handleSubmit(values: any) {
        const {email, password, firstName, lastName, city, state} = values;
        try {
            const {data} = await arAxios.post("/auth/register", {
                email,
                password,
                firstName,
                lastName,
                city,
                state
            });
            if (data) {
                localStorage.setItem("accessToken", data.accessToken);
                setState({
                    userId: data.userId,
                    displayName: data.displayName
                });
                props.history.push("/profile");
                window.location.reload();
            }
        } catch (err) {
            enqueueSnackbar("Email Already Registered", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
        }
    }

    return (
        <AuthContainerStyles className={classes.root}>
            <TermsAndConditions open={open} onClose={handleClose}/>
            <AuthPageSplash/>
            <AuthCard square>
                <CardContent>
                    <Typography variant="h6">
                        CREATE AN ACCOUNT
                    </Typography>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {props => (
                            <Form name="registerForm">
                                <FormikTextField
                                    type="text"
                                    name="firstName"
                                    label="First Name"
                                />
                                <FormikTextField
                                    type="text"
                                    name="lastName"
                                    label="Last Name"
                                />
                                <AddressInput
                                    placeholder={``}
                                    handleChange={(city: string, state: string) => {
                                        props.setFieldValue("city", city);
                                        props.setFieldValue("state", state);
                                    }}
                                />
                                <FormikTextField type="email" name="email" label="Email"/>
                                <FormikTextField
                                    type="password"
                                    name="password"
                                    label="Password"
                                />
                                <FormikTextField
                                    label="Password (Confirm)"
                                    type="password"
                                    name="passwordConfirm"
                                />
                                <FormControl>
                                    <Field
                                        Label={{
                                            label: (
                                                <span>I read and accept{" "}<a onClick={() => setOpen(true)}>terms and conditions</a></span>
                                            )
                                        }}
                                        name="acceptTermsConditions"
                                        id="termsAndConditions"
                                        component={CheckboxWithLabel}
                                    />
                                </FormControl>

                                <Button
                                    id="createAccount"
                                    variant="contained"
                                    color="primary"
                                    aria-label="Register"
                                    disabled={!props.isValid}
                                    type="submit"
                                >
                                    CREATE AN ACCOUNT
                                </Button>
                            </Form>
                        )}
                    </Formik>
                    <div className="no-account">
                        <span className="font-medium">Already have an account?</span>
                        <Link className="font-medium" to="/login">
                            Login
                        </Link>
                        <Link className="font-medium" to="/register-company">
                            Company? Request Access
                        </Link>
                    </div>
                </CardContent>
            </AuthCard>
        </AuthContainerStyles>
    );
}

export default RegistrationPage;
