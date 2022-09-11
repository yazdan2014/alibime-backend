<script>
import { mapGetters } from "vuex";
// import { ordersData } from "./data";
import moment from "moment-jalaali";
import { required } from "vuelidate/lib/validators";

/**
 * Orders component
 */
export default {
  head() {
    return {
      title: `داشبورد - ${this.title} | علی بیمه`,
    };
  },
  data() {
    return {
      ordersData: [],
      title: "سفارش ها",
      items: [
        {
          text: "علی‌بیمه  ",
        },
        {
          text: "لیست سفارش ها",
        },
        {
          text: "سفارش ها",
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "createdDate",
      sortDesc: true,
      fields: [
        {
          key: "username",
          label: "نام کاربری",
        },
        {
          key: "fullName",
          label: "نام و نام خانوادگی",
        },
        {
          key: "mobilePhone",
          label: "شماره همراه",
        },
        {
          key: "role",
          label: "سطح دسترسی",
        },
        {
          key: "lastLogin",
          label: "آخرین ورود به پنل",
        },
        {
          key: "actions",
          label: "عملیات",
        },
      ],
      showmodal: false,
      submitted: false,
      username: null,
      password: null,
      mobileNumber: null,
      firstname: null,
      lastname: null,
      role: null,
      loading: false,
      showDeleteModal: false,
      showNotAccess: false,
      validations: {
        lists: {
          username: {
            required,
          },
          password: {
            required,
          },
          mobileNumber: {
            required,
          },
          role: {
            required,
          },
        },
      },
    };
  },

  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
      info: "auth/getInfo",
      // provinces: "getProvinces"
    }),
    rows() {
      // return this.ordersData.length;
    },
  },
  mounted() {
    // Set the initial number of items
    // this.totalRows = this.items.length;
    this.getAdmins();
  },
  methods: {
    getAdmins() {
      this.$store
        .dispatch("admins/getAdmins")
        .then((result) => {
          const resultArray = result;
          for (let index = 0; index < result.length; index++) {
            const element = resultArray[index];
            const row = {
              username: element.username,
              fullName: element.firstname + " " + element.lastname,
              mobilePhone: element.mobilePhone,
              role: element.role,
            };
            this.ordersData.push(row);
          }
          console.log(this.ordersData); // eslint-disable-line
        })
        .catch((error) => {
          console.log(error); // eslint-disable-line
        });
    },
    newAdminData() {
      const data = {
        username: this.username,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname,
        mobilePhone: this.mobileNumber,
        role: this.role,
      };
      this.addAdmin(data);
    },
    addAdmin(data) {
      this.loading = true;
      this.$store.dispatch("admins/addNewAdmin", data).then((result) => {
        // eslint-disable-next-line
        console.log("ادمین جدید اضافه شد");
        this.loading = false;
        this.showmodal = false;
      });
    },
    goTodetail(id) {
      this.showmodal = true;
      console.log(id);
    },
    deleteModal() {
      this.showDeleteModal = true;
    },
    deleteAdmin(username) {
      this.$store
        .dispatch("admins/deleteAdmin", username)
        .then((result) => {
          console.log(result); // eslint-disable-next-line
          console.log("ادمین با موفقیت حذف شد!"); // eslint-disable-next-line
          this.showDeleteModal = false;
        })
        .catch((error) => {
          console.log("error is:" + error); // eslint-disable-line
          this.showDeleteModal = false;
          this.showNotAccess = true;
        });
    },
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    hideModal(e) {
      this.submitted = false;
      this.showmodal = false;
    },
  },
  middleware: ["check-auth", "auth"],
};
</script>

<template>
  <div>
    <PageHeader :title="title" :items="items" />
    <div v-if="info.role === 'superAdmin' || info.role === 'powerAdmin'">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row mb-2">
                <div class="col-sm-6">
                  <a
                    class="btn text-white btn-success"
                    href="javascript: void(0);"
                    @click="showmodal = true"
                  >
                    <i class="mdi mdi-plus-circle mr-1"></i>
                    اضافه کردن
                  </a>
                </div>

                <b-modal
                  id="modal-1"
                  v-model="showmodal"
                  title="اضافه کردن ادمین جدید"
                  header-close-variant="light"
                  title-class="font-18"
                  hide-footer
                >
                  <form @submit.prevent="newAdminData">
                    <div class="form-group">
                      <label for="name">نام کاربری</label>
                      <input
                        id="name"
                        v-model="username"
                        type="text"
                        class="form-control"
                        placeholder="نام کاربری"
                        :class="{
                          'is-invalid': submitted && $v.username.$error,
                        }"
                      />
                    </div>
                    <div class="form-group">
                      <label for="location">رمز</label>
                      <input
                        id="location"
                        v-model="password"
                        type="text"
                        class="form-control"
                        placeholder="رمز را وارد کنید"
                        :class="{
                          'is-invalid': submitted && $v.password.$error,
                        }"
                      />
                    </div>
                    <div class="form-group">
                      <label for="location">شماره همراه</label>
                      <input
                        id="location"
                        v-model="mobileNumber"
                        type="text"
                        class="form-control"
                        placeholder="شماره همراه"
                        :class="{
                          'is-invalid': submitted && $v.password.$error,
                        }"
                      />
                    </div>
                    <div class="form-group">
                      <label for="location">نام</label>
                      <input
                        id="location"
                        v-model="firstname"
                        type="text"
                        class="form-control"
                        placeholder="نام"
                        :class="{
                          'is-invalid': submitted && $v.password.$error,
                        }"
                      />
                    </div>
                    <div class="form-group">
                      <label for="location">نام خانوادگی</label>
                      <input
                        id="location"
                        v-model="lastname"
                        type="text"
                        class="form-control"
                        placeholder="نام خانوادگی"
                        :class="{
                          'is-invalid': submitted && $v.password.$error,
                        }"
                      />
                    </div>
                    <div class="form-group">
                      <label for="location">سطح دسترسی</label>

                      <h5 class="mt-0 dis-grid">
                        <div class="radio form-check-inline pt-2">
                          <input
                            type="radio"
                            v-model="role"
                            id="inlineRadio1"
                            value="superAdmin"
                            name="radioInline"
                            checked
                          />
                          <label for="inlineRadio1">superAdmin</label>
                        </div>
                        <div class="radio form-check-inline pt-2">
                          <input
                            v-model="role"
                            type="radio"
                            id="inlineRadio2"
                            value="powerAdmin"
                            name="radioInline"
                            checked
                          />
                          <label for="inlineRadio2">powerAdmin</label>
                        </div>
                        <div class="radio form-check-inline pt-2">
                          <input
                            v-model="role"
                            type="radio"
                            id="inlineRadio4"
                            value="admin-lvl1"
                            name="radioInline"
                          />
                          <label for="inlineRadio4">admin-lvl1</label>
                        </div>
                        <div class="radio form-check-inline pt-2">
                          <input
                            v-model="role"
                            type="radio"
                            id="inlineRadio5"
                            value="admin-lvl2"
                            name="radioInline"
                          />
                          <label for="inlineRadio5">admin-lvl2</label>
                        </div>
                        <div class="radio form-check-inline pt-2">
                          <input
                            v-model="role"
                            type="radio"
                            id="inlineRadio5"
                            value="support"
                            name="radioInline"
                          />
                          <label for="inlineRadio5">support</label>
                        </div>
                      </h5>
                    </div>
                    <div class="text-right">
                      <button type="submit" class="btn btn-success">
                        اضافه کردن
                      </button>
                    </div>
                  </form>
                </b-modal>

                <div class="col-sm-12 col-md-6">
                  <div
                    id="tickets-table_filter"
                    class="dataTables_filter text-md-right"
                  >
                    <label class="d-inline-flex align-items-center">
                      جستجو:
                      <b-form-input
                        v-model="filter"
                        type="search"
                        placeholder="جستجو..."
                        class="form-control form-control-sm ml-2"
                      ></b-form-input>
                    </label>
                  </div>
                </div>
                <!-- End search -->
              </div>
              <!-- Table -->
              <div class="table-responsive mb-0">
                <b-table
                  table-class="table table-centered w-100"
                  thead-tr-class="bg-light"
                  :items="ordersData"
                  :fields="fields"
                  :hover="true"
                  responsive="sm"
                  :per-page="perPage"
                  :current-page="currentPage"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :filter="filter"
                  :filter-included-fields="filterOn"
                  @filtered="onFiltered"
                >
                  <template v-slot:cell(username)="data">
                    {{ data.item.username }}
                  </template>
                  <template v-slot:cell(fullName)="data" class="orderName">
                    {{ data.item.fullName }}
                  </template>
                  <template v-slot:cell(mobilePhone)="data">
                    {{ data.item.mobilePhone }}
                  </template>
                  <template v-slot:cell()="data">
                    {{ data.item.createdDate }}
                    <small class="text-muted">{{
                      data.item.createdTime
                    }}</small>
                  </template>
                  <template v-slot:cell(role)="data">
                    {{ data.item.role }}
                  </template>
                  <template v-slot:cell(actions)="data">
                    <ul class="list-inline table-action m-0">
                      <li
                        class="list-inline-item action-icon"
                        @click="goTodetail(data.item.actions)"
                      >
                        <i class="mdi mdi-square-edit-outline"></i>
                      </li>
                      <li
                        class="list-inline-item title-edit"
                        @click="deleteModal(data.item.actions)"
                      >
                        <a href="javascript:void(0);" class="action-icon">
                          <i class="mdi mdi-delete"></i
                        ></a>
                      </li>
                      <b-modal
                        id="CardFront"
                        v-model="showDeleteModal"
                        title="حذف سفارش"
                        header-close-variant="light"
                        title-class="font-18"
                        size="md"
                        hide-footer
                      >
                        <form @submit.prevent="deleteAdmin(data.item.username)">
                          <div class="form-group">
                            <label for="name"
                              >یکی از گزینه ها را انتخاب کنید:</label
                            >

                            <div class="text-right">
                              <button type="submit" class="btn btn-success">
                                حذف سفارش
                              </button>
                              <b-button
                                class="ml-1"
                                variant="danger"
                                @click="hideModal"
                                >پشیمون شدم!</b-button
                              >
                            </div>
                          </div>
                        </form></b-modal
                      >
                      <b-modal
                        id="CardFront"
                        v-model="showNotAccess"
                        header-close-variant="light"
                        title-class="font-18"
                        size="lg"
                        hide-footer
                        hide-header
                      >
                        <h2>شما دسترسی لازم برای حذف ادمین را ندارید!</h2>
                      </b-modal>
                    </ul>
                  </template>
                </b-table>
              </div>
              <div class="row">
                <div class="col">
                  <div
                    class="
                      dataTables_paginate
                      paging_simple_numbers
                      float-right
                    "
                  >
                    <ul class="pagination pagination-rounded">
                      <!-- pagination -->
                      <b-pagination
                        v-model="currentPage"
                        :total-rows="rows"
                        :per-page="perPage"
                      ></b-pagination>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="col-md-8 col-lg-6 col-xl-5 mx-auto">
        <div class="card">
          <div class="card-body p-4">
            <div class="error-ghost text-center">
              <img
                src="~/assets/images/error.svg"
                width="200"
                alt="error-image"
              />
            </div>

            <div class="text-center">
              <h3 class="mt-4 text-uppercase font-weight-bold">
                شما دسترسی به این صفحه ندارید!
              </h3>
              <p class="text-muted mb-0 mt-3" style="line-height: 20px">
                همکار گرامی این صفحه محافظت شده است و مدیران اصلی فقط دسترسی
                دیدن این صفحه را دارند! چنانچه شماهم از مدیران اصلی علی‌بیمه
                هستین اما این صفحه را مشاهده نمیکنید لطفا با واحد فنی علی بیمه
                تماس بگیرید. با تشکر مدیر فنی
              </p>

              <nuxt-link to="/" class="btn btn-primary mt-3"
                ><i class="mdi mdi-reply mr-1"></i> رفتن به داشبورد</nuxt-link
              >
            </div>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->
      </div>
    </div>
  </div>
</template>
<style scoped>
.orderName td {
  font-weight: 600;
}
</style>
