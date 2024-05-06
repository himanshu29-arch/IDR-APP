import * as yup from "yup";
import { passwordnum, passwordregcap, passwordregsm, passwordspl, validateEmail } from "./regex";

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("The Email ID you entered is incorrect.")
    .matches(validateEmail, "The Email ID you entered is incorrect.")
    .required("Email is required"),
  password: yup
    .string()
    //   .min(8, ({ min }) => `password must be minimum ${min} characters`)
    //   .matches(passwordregsm, `password must have at least one small letter`)
    //   .matches(passwordregcap, `password must have at least one capital letter`)
    //   .matches(passwordnum, `password must have at least one number`)
    //   .matches(passwordspl, `password must have at least one special characters`)
    //   .max(
    //     12,
    //     ({ max }) => `Has at least 8 characters (no spaces)\nHas letters, numbers, and special characters`,
    //   )
    .required("Password is required"),
});


export const generateTicket = yup.object().shape({
  ContactEmail: yup
    .string()
    .email("The Email ID you entered is incorrect.")
    .matches(validateEmail, "The Email ID you entered is incorrect.")
    .required("Email is required"),
  WorkOrdertype: yup
    .string()
    .required("Work Order type is required"),
  PONumber: yup
    .string()
    .required("PO Number is required"),
  ClientSite: yup
    .string()
    .required("Client Site is required"),
  ContactPerson: yup
    .string()
    .required("Contact Person name is required"),
  ContactPhone: yup
    .string()
    .required("Contact Phone is required"),
  Issue: yup
    .string()
    .required("Issue is required"),
});

export const technicianName = yup.object().shape({
  TechnicianName: yup
    .string()
    .required("Technician Name is required"),
  projectManager: yup
    .string()
    .required("projectManager Name is required"),
  serviceRequest: yup
    .string()
    .required("service Request is required"),
  otherDetails: yup
    .string()
    .required("Other Details is required"),
  procedures: yup
    .string()
    .required("Procedures is required"),
});

export const addNoteSchema = yup.object().shape({
  parts: yup
    .string()
    .required("Parts are required"),
  LabelingMethodology: yup
    .string()
    .required("Labelling Methodology is required"),
  EquipmentRequired: yup
    .string()
    .required("Equipments Required"),
  RequireDeliverables: yup
    .string()
    .required("Required Deliverables"),
  DeliverableInstructions: yup
    .string()
    .required("Deliverable Instructions are required"),
});


export const workorderview = yup.object().shape({

  ContactEmail: yup
    .string()
    .email("The Email ID you entered is incorrect.")
    .matches(validateEmail, "The Email ID you entered is incorrect.")
    .required("Email is required"),
  WorkOrdertype: yup
    .string()
    .required("Work Order type is required"),
  PONumber: yup
    .string()
    .required("PO Number is required"),
  ClientSite: yup
    .string()
    .required("Client Site is required"),
  ContactPerson: yup
    .string()
    .required("Contact Person name is required"),
  ContactPhone: yup
    .string()
    .required("Contact Phone is required"),
  Issue: yup
    .string()
    .required("Issue is required"),
  ServiceDate: yup
    .string()
    .required("Service Date is required"),
    ContactMail: yup
    .string()
    .required("Service Date is required"),
})