const validateEmail = (email) => {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email)) return "Invalid email address";
  return null;
};

const validatePassword = (password, { minLength = 8, requireUppercase = true, requireNumber = true, requireSpecial = true } = {}) => {
  if (!password) return "Password is required";
  if (password.length < minLength) return `Password must be at least ${minLength} characters`;
  if (requireUppercase && !/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (requireNumber && !/[0-9]/.test(password)) return "Password must contain a number";
  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain a special character";
  return null;
};

export const validateLogin = (formData) => {
  const errors = {};
  const emailErr = validateEmail(formData.email || "");
  if (emailErr) errors.email = emailErr;

  if (!formData.password) {
    errors.password = "Password is required";
  }
  return errors;
};

export const validateRegister = (formData) => {
  const errors = {};
  if (!formData.name?.trim()) errors.name = "Name is required";
  else if (formData.name.trim().length < 2) errors.name = "Name must be at least 2 characters";

  const emailErr = validateEmail(formData.email || "");
  if (emailErr) errors.email = emailErr;

  const passErr = validatePassword(formData.password || "");
  if (passErr) errors.password = passErr;

  if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password";
  else if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";

  return errors;
};

export const validatePasswordStrength = (password) => {
  let score = 0;
  if (!password) return { score: 0, label: "", color: "", requirements: {} };

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  const colors = ["", "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500", "bg-emerald-500"];
  const labels = ["", "Weak", "Fair", "Fair", "Good", "Strong", "Very Strong"];

  return {
    score: Math.min(score, 6),
    label: labels[Math.min(score, 6)] || "",
    color: colors[Math.min(score, 6)] || "",
    requirements: {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  };
};

export const calculatePasswordStrength = (password) => {
  validatePasswordStrength(password);
  let numericStrength = 0;
  if (password.length >= 8) numericStrength++;
  if (password.length >= 10) numericStrength++;
  if (/[A-Z]/.test(password)) numericStrength++;
  if (/[0-9]/.test(password)) numericStrength++;
  if (/[^A-Za-z0-9]/.test(password)) numericStrength++;
  return numericStrength;
};
