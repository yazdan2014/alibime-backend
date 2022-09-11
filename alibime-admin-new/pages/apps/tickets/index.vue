<script>
import { mapGetters } from "vuex";
import { widgetData, tableData } from "./data";

export default {
  head() {
    return {
      title: `داشبورد - ${this.title} | علی بیمه`,
    };
  },
  data() {
    return {
      widgetData: widgetData,
      tableData: tableData,
      title: "Tickets",
      items: [
        {
          text: "alibime",
          href: "/",
        },
        {
          text: "Apps",
          href: "/",
        },
        {
          text: "Tickets",
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "age",
      sortDesc: false,
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: false,
        },
        {
          label: "شماره مشتری",
          key: "name",
          sortable: false,
        },
        {
          label: "موضوع",
          key: "subject",
          sortable: false,
        },
        {
          label: "وضعیت",
          key: "status",
          sortable: false,
        },
        {
          key: "createddate",
          label: "زمان ثبت تیکت",
          sortable: false,
        },
        {
          label: "آخرین تغییرات",
          key: "duedate",
          sortable: false,
        },
        "action",
      ],
    };
  },
  computed: {
    ...mapGetters({
      info: "auth/getInfo",
    }),
    rows() {
      return this.tableData.length;
    },
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
  methods: {
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
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
              <div class="text-center">
                <div class="row">
                  <div class="col-md-6 col-xl-3">
                    <div class="py-1">
                      <i class="fe-tag font-24"></i>
                      <h3>10</h3>
                      <p class="text-uppercase mb-1 font-13 font-weight-medium">
                        تعداد کل تیکت ها
                      </p>
                    </div>
                  </div>
                  <div class="col-md-6 col-xl-3">
                    <div class="py-1">
                      <i class="fe-archive font-24"></i>
                      <h3 class="text-warning">5</h3>
                      <p class="text-uppercase mb-1 font-13 font-weight-medium">
                        تیکت های در حال انتظار
                      </p>
                    </div>
                  </div>
                  <div class="col-md-6 col-xl-3">
                    <div class="py-1">
                      <i class="fe-shield font-24"></i>
                      <h3 class="text-success">40</h3>
                      <p class="text-uppercase mb-1 font-13 font-weight-medium">
                        تیکت های بسته شده
                      </p>
                    </div>
                  </div>
                  <div class="col-md-6 col-xl-3">
                    <div class="py-1">
                      <i class="fe-delete font-24"></i>
                      <h3 class="text-danger">0</h3>
                      <p class="text-uppercase mb-1 font-13 font-weight-medium">
                        تیکت های پاک شده
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row mb-2">
                <div class="col-sm-12 col-md-6">
                  <div id="tickets-table_length" class="dataTables_length">
                    <label class="d-inline-flex align-items-center">
                      Display&nbsp;
                      <b-form-select
                        v-model="perPage"
                        size="sm"
                        :options="pageOptions"
                      ></b-form-select
                      >&nbsp;Tickets
                    </label>
                  </div>
                </div>
                <!-- Search -->
                <div class="col-sm-12 col-md-6">
                  <div
                    id="tickets-table_filter"
                    class="dataTables_filter text-md-right"
                  >
                    <label class="d-inline-flex align-items-center">
                      Search:
                      <b-form-input
                        v-model="filter"
                        type="search"
                        placeholder="Search..."
                        class="form-control form-control-sm ml-2"
                      ></b-form-input>
                    </label>
                  </div>
                </div>
                <!-- End search -->
              </div>
              <b-table
                table-class="table table-centered w-100"
                thead-tr-class="bg-light"
                :items="tableData"
                :fields="fields"
                responsive="sm"
                :per-page="perPage"
                :current-page="currentPage"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
              >
                <template v-slot:cell(id)="data">
                  <b> {{ data.item.id }}</b>
                </template>
                <template v-slot:cell(subject)="data">
                  {{ data.item.subject }}
                </template>
                <!-- <template v-slot:cell(assignuser)="data">
                <img
                  :src="data.item.assignuser"
                  alt="contact-img"
                  title="contact-img"
                  class="avatar-sm rounded-circle img-thumbnail"
                />
              </template> -->

                <template v-slot:cell(priority)="data">
                  <span
                    class="badge"
                    :class="{
                      'badge-danger': data.item.priority === 'High',
                      'badge-secondary': data.item.priority === 'Low',
                      'badge-warning': data.item.priority === 'Medium',
                    }"
                    >{{ data.item.priority }}</span
                  >
                </template>

                <template v-slot:cell(createddate)="data">
                  {{ data.item.createddate }}
                </template>
                <template v-slot:cell(duedate)="data">
                  {{ data.item.duedate }}
                </template>
                <template v-slot:cell(status)="data">
                  <span
                    class="badge"
                    :class="{
                      'badge-secondary': data.item.status === 'بسته شده',
                      'badge-success': data.item.status === 'باز',
                    }"
                  >
                    {{ data.item.status }}</span
                  >
                </template>
                <template v-slot:cell()="data">
                  <a href="javascript: void(0);" class="text-dark">
                    <!-- <img
                    :src="data.item.requestuser"
                    alt="contact-img"
                    title="contact-img"
                    class="avatar-sm rounded-circle img-thumbnail"
                  /> -->
                    <span class="ml-2">{{ data.item.name }}</span>
                  </a>
                </template>
                <template v-slot:cell(action)>
                  <b-dropdown
                    class="btn-group"
                    right
                    toggle-class="arrow-none btn-light btn-sm"
                  >
                    <template v-slot:button-content>
                      <i class="mdi mdi-dots-horizontal"></i>
                    </template>
                    <b-dropdown-item
                      ><i
                        class="
                          mdi mdi-pencil
                          mr-2
                          text-muted
                          font-18
                          vertical-middle
                        "
                      ></i
                      >ویرایش تیکت</b-dropdown-item
                    >
                    <b-dropdown-item
                      ><i
                        class="
                          mdi mdi-check-all
                          mr-2
                          text-muted
                          font-18
                          vertical-middle
                        "
                      ></i
                      >بستن تیکت</b-dropdown-item
                    >
                    <b-dropdown-item
                      ><i
                        class="
                          mdi mdi-delete
                          mr-2
                          text-muted
                          font-18
                          vertical-middle
                        "
                      ></i
                      >حذف تیکت</b-dropdown-item
                    >
                    <!-- <b-dropdown-item
                    ><i
                      class="mdi mdi-star mr-2 font-18 text-muted vertical-middle"
                    ></i
                    >Mark as Unread</b-dropdown-item
                  > -->
                  </b-dropdown>
                </template>
              </b-table>
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
