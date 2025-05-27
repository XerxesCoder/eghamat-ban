export const persianClerk = {
  socialButtonsBlockButton: "ورود با ایمیل",
  dividerText: "یا",
  formFieldLabel__emailAddress_username: "نام کاربری یا ایمیل ",
  formFieldInputPlaceholder__emailAddress_username: "نام کاربری یا ایمیل ",
  formFieldLabel__password: "رمز عبور",
  formFieldLabel__username: "نام کاربری",
  formFieldLabel__emailAddress: "ایمیل",
  formFieldLabel__emailAddresses: "ایمیل ها",
  formFieldInputPlaceholder__emailAddress: "ایمیل خود را وارد کنید",
  formFieldInputPlaceholder__password: "رمز عبور خود را وارد کنید",
  formFieldAction__forgotPassword: "فراموشی رمز عبور",
  formFieldError__notMatchingPasswords: "رمز عبور ها یکسان نیستند",
  formFieldLabel__firstName: "نام",
  formFieldLabel__lastName: "نام خانوادگی",
  backButton: "بازگشت",
  formButtonPrimary: "ادامه",
  formButtonPrimary__verify: "تایید",
  footerActionLink__useAnotherMethod: "با روش دیگری وارد شوید",
  unstable__errors: {
    form_code_incorrect: "کد وارد شده اشتباه است",
    form_password_length_too_short: "رمز عبور باید حداقل 8 کاراکتر باشد",
    form_password_not_strong_enough: "رمز عبور باید حداقل 8 کاراکتر باشد",
    form_password_pwned:
      "رمز عبور شما به صورت قبلی در اینترنت منتشر شده است و نمیتواند استفاده شود",
    form_password_pwned__sign_in:
      "رمز عبور شما به صورت قبلی در اینترنت منتشر شده است و نمیتواند استفاده شود",
    passwordComplexity: {
      maximumLength: "کوچکتر از  {{length}} کاراکتر",
      minimumLength: "بیشتر  از  {{length}} کاراکتر باشد",
      requireLowercase: "یک حروف کوچک",
      requireNumbers: "یک عدد",
      requireSpecialCharacter: "یه نشانه",
      requireUppercase: "یک حرف بزرگ",
      sentencePrefix: "رمز عبور باید",
    },
    zxcvbn: {
      couldBeStronger: "میتونی یه رمز عبور قوی تر بسازی",
      goodPassword: "امینت رمز عبور شما بالاست",
    },
  },

  signUp: {
    start: {
      title: "ایجاد حساب کاربری",
      subtitle: "برای ورود به اقامت بان",
      actionText: "حساب کاربری دارید؟",
      actionLink: "ورود",
    },

    emailLink: {
      title: "ایمیل خود را تایید کنید",
      subtitle: "برای اقامت بان",
      formTitle: "لینک تایید",
      formSubtitle: "کد تایید ایمیل خود را وارد کنید",
      resendButton: "کدی دریافت نکردید؟ ارسال دوباره",
      verified: {
        title: "با موفقیت ایمیل تایید شد",
      },
      loading: {
        title: "در حال ایجاد حساب کاربری",
      },
      verifiedSwitchTab: {
        title: "ایمیل تایید شد",
        subtitle: "Return to the newly opened tab to continue",
        subtitleNewTab: "Return to previous tab to continue",
      },
    },
    emailCode: {
      title: "تایید ایمیل",
      subtitle: "برای ورود به اقامت بان",
      formTitle: "کد تایید",
      formSubtitle: "کد تایید ایمیل خود را وارد کنید",
      resendButton: "کدی دریافت نکردید؟ ارسال دوباره",
    },
    continue: {
      title: "فیلد های خالی را پر کنید",
      subtitle: "برای اقامت بان",
      actionText: "حساب کاربری دارید؟",
      actionLink: "ورود",
    },
  },
  signIn: {
    start: {
      title: "ورود به حساب کاربری",
      subtitle: "برای ورود به اقامت بان",
      actionText: "حساب کاربری ندارید؟",
      actionLink: "ایجاد حساب کاربری",
    },
    password: {
      title: "رمز عبور",
      subtitle: "رمز عبور خود را وارد کنید",
      actionLink: "با روش دیگری وارد شوید",
    },

    alternativeMethods: {
      actionLink: "نیاز به کمک دارم",
      actionText: "دسترسی ندارید؟",
      blockButton__backupCode: "Use a backup code",
      blockButton__emailCode: "ارسال کد به {{identifier}}",
      blockButton__emailLink: "ارسال لینک به {{identifier}}",
      getHelp: {
        blockButton__emailSupport: "ارسال ایمیل پشتیبانی",
        content:
          "در صورتی که به مشکل برخوردید، ما برای شما آماده هستیم تا به شما کمک کنیم. لطفا با ما تماس بگیرید.",
        title: "نیاز به کمک دارم",
      },
      subtitle: "میتوانید با روش دیگری وارد شوید",
      title: "انتخاب روش ورود",
    },
    forgotPasswordAlternativeMethods: {
      blockButton__resetPassword: "بازیابی رمز عبور",
      label__alternativeMethods: "یا با روش دیگری وارد شوید",
      title: "رمزتان را فراموش کرده اید؟",
    },
    emailCode: {
      formTitle: "کد تایید",
      resendButton: "کدی برای شما ارسال نشده است؟ ارسال دوباره",
      subtitle: "برای ادامه به اقامت بان",
      title: "ایمیل خود را چک کنید",
    },
  },

  userButton: {
    action__manageAccount: "مدیریت حساب کاربری",
    action__signOut: "خروج از حساب",
  },
  userProfile: {
    profilePage: {
      fileDropAreaHint: "حجم تصویر باید کمتر از 10MB باشد.",
      imageFormDestructiveActionSubtitle: "حذف",
      imageFormSubtitle: "آپلود",
      imageFormTitle: "تصویر پروفایل",
      readonly: "اطلاعات پروفایل",
      successMessage: "با موفقیت ذخیره شد.",
      title: "تنظیمات پروفایل",
    },
    mobileButton__menu: "Menu",
    navbar: {
      account: "حساب کاربری",
      billing: "پرداخت",
      description: "مدیریت حساب کاربری",
      security: "امنیت",
      title: "حساب کاربری",
    },
  },
};
