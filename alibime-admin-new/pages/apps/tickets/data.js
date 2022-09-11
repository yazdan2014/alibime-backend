const widgetData = [
  {
    icon: "fe-tag",
    tickets: 25563,
    title: "Total tickets",
    text: ""
  },
  {
    icon: "fe-archive",
    tickets: 6952,
    title: "Pending Tickets",
    text: "warning"
  },
  {
    icon: "fe-shield",
    tickets: 18361,
    title: "بسته شده Tickets",
    text: "success"
  },
  {
    icon: "fe-delete",
    tickets: 250,
    title: "Deleted Tickets",
    text: "danger"
  }
];

const tableData = [
  {
    id: "1020",
    requestuser: require("~/assets/images/users/avatar-9.jpg"),
    name: "09126818995",
    subject: "مشکل پرداخت صورتحساب",
    assignuser: require("~/assets/images/users/avatar-1.jpg"),
    priority: "Medium",
    status: "بسته شده",
    createddate: "08/11/2013",
    duedate: "21/06/2013"
  },
  {
    id: "1254",
    requestuser: require("~/assets/images/users/avatar-8.jpg"),
    name: "09126818995",
    subject: "مشکل اطلاعات ارسالی بیمه بدنه",
    assignuser: require("~/assets/images/users/avatar-10.jpg"),
    priority: "High",
    status: "بسته شده",
    createddate: "01/04/2017",
    duedate: "21/05/2017"
  },
  {
    id: "1256",
    requestuser: require("~/assets/images/users/avatar-2.jpg"),
    name: "09126818995",
    subject: "خراب بودن بخش باشگاه مشتریان",
    assignuser: require("~/assets/images/users/avatar-10.jpg"),
    priority: "Low",
    status: "باز",
    createddate: "28/04/2017",
    duedate: "12/05/2017"
  },
  {
    id: "1352",
    requestuser: require("~/assets/images/users/avatar-5.jpg"),
    name: "09126818995",
    subject: "مشکل کم شدن امتیاز باشگاه",
    assignuser: require("~/assets/images/users/avatar-8.jpg"),
    priority: "High",
    status: "باز",
    createddate: "01/04/2017",
    duedate: "21/05/2017"
  },
  {
    id: "2251",
    requestuser: require("~/assets/images/users/avatar-8.jpg"),
    name: "09126818995",
    subject: "مشکل درگاه پرداخت",
    assignuser: require("~/assets/images/users/avatar-10.jpg"),
    priority: "High",
    status: "باز",
    createddate: "01/04/2017",
    duedate: "21/05/2017"
  },
  {
    id: "2542",
    requestuser: require("~/assets/images/users/avatar-3.jpg"),
    name: "09126818995",
    subject: "پیگیری وضعیت سفارش",
    assignuser: require("~/assets/images/users/avatar-9.jpg"),
    priority: "Medium",
    status: "بسته شده",
    createddate: "25/04/2008",
    duedate: "12/06/2008"
  }
  //   {
  //     id: "3200",
  //     requestuser: require("~/assets/images/users/avatar-5.jpg"),
  //     name: "09126818995",
  //     subject: "Verify your new email address!",
  //     assignuser: require("~/assets/images/users/avatar-10.jpg"),
  //     priority: "High",
  //     status: "باز",
  //     createddate: "20/04/2017",
  //     duedate: "25/04/2017"
  //   },
  //   {
  //     id: "3562",
  //     requestuser: require("~/assets/images/users/avatar-8.jpg"),
  //     name: "09126818995",
  //     subject: "Security alert for my account",
  //     assignuser: require("~/assets/images/users/avatar-2.jpg"),
  //     priority: "Low",
  //     status: "باز",
  //     createddate: "01/04/2017",
  //     duedate: "21/05/2017"
  //   },
  //   {
  //     id: "3653",
  //     requestuser: require("~/assets/images/users/avatar-3.jpg"),
  //     name: "09126818995",
  //     subject: "Item Support Message sent",
  //     assignuser: require("~/assets/images/users/avatar-10.jpg"),
  //     priority: "Medium",
  //     status: "بسته شده",
  //     createddate: "01/04/2017",
  //     duedate: "21/05/2017"
  //   },
  //   {
  //     id: "3653",
  //     requestuser: require("~/assets/images/users/avatar-4.jpg"),
  //     name: "09126818995",
  //     subject: "Your password has been resett",
  //     assignuser: require("~/assets/images/users/avatar-10.jpg"),
  //     priority: "Low",
  //     status: "باز",
  //     createddate: "01/04/2017",
  //     duedate: "21/05/2017"
  //   },
  //   {
  //     id: "3654",
  //     requestuser: require("~/assets/images/users/avatar-2.jpg"),
  //     name: "09126818995",
  //     subject: "Support for theme",
  //     assignuser: require("~/assets/images/users/avatar-10.jpg"),
  //     priority: "Low",
  //     status: "باز",
  //     createddate: "01/04/2017",
  //     duedate: "21/05/2017"
  //   },
  //   {
  //     id: "3658",
  //     requestuser: require("~/assets/images/users/avatar-9.jpg"),
  //     name: "09126818995",
  //     subject: "Christopher S. Ahmad",
  //     assignuser: require("~/assets/images/users/avatar-10.jpg"),
  //     priority: "Medium",
  //     status: "بسته شده",
  //     createddate: "01/04/2017",
  //     duedate: "21/05/2017"
  //   },
  //   {
  //     id: "8504",
  //     requestuser: require("~/assets/images/users/avatar-2.jpg"),
  //     name: "09126818995",
  //     subject: "Your Profile has been accepted",
  //     assignuser: require("~/assets/images/users/avatar-10.jpg"),
  //     priority: "High",
  //     status: "باز",
  //     createddate: "01/04/2017",
  //     duedate: "21/05/2017"
  //   },
  //   {
  //     id: "9501",
  //     requestuser: require("~/assets/images/users/avatar-10.jpg"),
  //     name: "09126818995",
  //     subject: "Homeworth for your property increased",
  //     assignuser: require("~/assets/images/users/avatar-3.jpg"),
  //     priority: "Low",
  //     status: "باز",
  //     createddate: "01/04/2017",
  //     duedate: "21/05/2017"
  //   },
  //   {
  //     id: "9852",
  //     requestuser: require("~/assets/images/users/avatar-5.jpg"),
  //     name: "09126818995",
  //     subject: "Your item has been updated!",
  //     assignuser: require("~/assets/images/users/avatar-10.jpg"),
  //     priority: "High",
  //     status: "باز",
  //     createddate: "01/04/2017",
  //     duedate: "21/05/2017"
  //   }
];

export { widgetData, tableData };
