import dayjs from "dayjs";

export const validateIssueDate = (_, value) => {
  const today = dayjs().startOf("day");
  if (!value) {
    return Promise.resolve();
  }
  const selectedDate = dayjs(value, "YYYY-MM-DD").startOf("day"); // Chuyển chuỗi thành dayjs
  if (selectedDate.isAfter(today)) {
    return Promise.reject(new Error("Issue date cannot be later than today"));
  }
  return Promise.resolve();
};

export const validateExpiredDate = (form) => (_, value) => {
  const issueDate = form.getFieldValue("issueDate");
  const today = dayjs().startOf("day");

  if (!value) {
    return Promise.reject("Please select an expired date.");
  }

  const expiredDate = dayjs(value, "YYYY-MM-DD").startOf("day"); // Chuyển chuỗi thành dayjs
  if (expiredDate.isBefore(today)) {
    return Promise.reject("Expired Date must be in the future.");
  }

  if (issueDate && expiredDate.isBefore(dayjs(issueDate, "YYYY-MM-DD"))) {
    return Promise.reject("Expired Date must be after Issue Date.");
  }

  return Promise.resolve();
};

// Validator cho Contact Number
export const validateContactNumber = (_, value) => {
  if (!value) {
    return Promise.reject(new Error("Please input contact number!"));
  }

  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(value)) {
    return Promise.reject(
      new Error("Contact number must be 10 digits and start with 0!")
    );
  }

  return Promise.resolve();
};