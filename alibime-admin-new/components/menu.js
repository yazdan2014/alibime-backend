export const menuItems = [
  {
    id: 1,
    label: "menuitems.navigation.text",
    isTitle: true
  },
  {
    id: 2,
    label: "menuitems.dashboard.text",
    icon: "ri-dashboard-line",
    link: "/dashboard/analytics",
    isMenuCollapsed: false
    // badge: {
    //   variant: "success",
    //   text: "menuitems.dashboard.badge"
    // },
    // subItems: [
    //   // {
    //   //   id: 3,
    //   //   label: "menuitems.dashboard.list.sales",
    //   //   link: "/"
    //   // },
    //   // {
    //   //   id: 4,
    //   //   label: "menuitems.dashboard.list.crm",
    //   //   link: "/dashboard/crm"
    //   // },
    //   {
    //     id: 5,
    //     label: "menuitems.dashboard.list.analytics",
    //     link: "/dashboard/analytics"
    //   }
    // ]
  },
  {
    id: 6,
    label: "menuitems.apps.text",
    isTitle: true
  },

  {
    id: 7,
    label: "menuitems.ecommerce.text",
    icon: "ri-shopping-cart-2-line",
    badge: {
      variant: "danger",
      text: "menuitems.ecommerce.badge"
    },
    isMenuCollapsed: false,
    subItems: [
      {
        id: 9,
        label: "نمایش همه",
        link: "/ecommerce/orders"
      },
      {
        id: 9,
        label: "تکمیل شده",
        link: "/ecommerce/orders"
      },
      {
        id: 9,
        label: "رفع نقص",
        link: "/ecommerce/orders"
      },
      {
        id: 9,
        label: "پرداخت شده",
        link: "/ecommerce/orders"
      },
      {
        id: 9,
        label: "پرداخت نشده",
        link: "/ecommerce/orders"
      },
      {
        id: 10,
        label: "menuitems.ecommerce.list.orderdetail",
        link: "/ecommerce/order-detail"
      }
    ]
  },
  {
    id: 11,
    label: "تراکنش‌ها",
    icon: "fe-credit-card",
    badge: {
      variant: "danger",
      text: "menuitems.ecommerce.badge"
    },
    isMenuCollapsed: false,
    subItems: [
      {
        id: 9,
        label: "همه تراکنش ها",
        link: "/ecommerce/transactions"
      },
      {
        id: 10,
        label: "تراکنش های موفق",
        link: "/ecommerce/transactions"
      },
      {
        id: 11,
        label: "تراکنش های ناموفق",
        link: "/ecommerce/transactions"
      }
    ]
  },
  {
    id: 12,
    label: "menuitems.ticket.text",
    icon: "ri-customer-service-2-line",
    link: "/apps/tickets"
  },
  {
    id: 13,
    label: "ادمین چت",
    icon: "fe-message-square",
    link: "/apps/chat"
  },
  {
    id: 14,
    label: "مشتریان",
    icon: "fe-user",
    link: "/ecommerce/customers"
  },
  {
    id: 20,
    label: "menuitems.email.text",
    icon: "ri-mail-line",
    isMenuCollapsed: false,
    subItems: [
      {
        id: 21,
        label: "menuitems.email.list.inbox",
        link: "/email/inbox"
      },
      {
        id: 22,
        label: "menuitems.email.list.reademail",
        link: "/email/reademail/1"
      }
    ]
  },
  {
    id: 24,
    label: "menuitems.companies.text",
    icon: "ri-building-4-line",
    link: "/apps/companies"
  },

  {
    id: 30,
    label: "ادمین ها",
    icon: "ri-profile-line",
    isMenuCollapsed: false,
    subItems: [
      {
        id: 31,
        label: "menuitems.contacts.list.members",
        link: "/admins/list"
      }
    ]
  },
  {
    id: 33,
    label: "menuitems.filemanager.text",
    icon: "ri-folders-line",
    link: "/apps/file-manager"
  },
  {
    id: 35,
    label: "تنظیمات",
    icon: "fe-settings",
    isMenuCollapsed: false,
    subItems: [
      {
        id: 36,
        label: "تغییر رمز عبور",
        link: "/contacts/list"
      },
      {
        id: 37,
        label: "گزارش باگ",
        link: "/contacts/profile"
      }
    ]
  }
];
