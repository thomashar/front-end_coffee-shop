<template>
    <div class="dashboard">
        <v-navigation-drawer
            v-model="drawer"
            color="white"
            class="fullheight"
            width="256"
            app>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="title">SIKafe</v-list-item-title>
                <v-list-item-subtitle v-model="nama">Selamat datang, {{ this.nama }} </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list v-if="role == 'Pemilik'" prominent nav dense >
            <v-list-item
                v-for="item in itemsPemilik"
                :key="item.title"
                link
                tag="router-link"
                :to="item.to"
            >
            <v-icon>{{ item.icon }}</v-icon>
                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <v-list v-else-if="role == 'Admin'" prominent nav dense>
            <v-list-item
                v-for="item in itemsAdmin"
                :key="item.title"
                link
                tag="router-link"
                :to="item.to"
            >
            <v-icon>{{ item.icon }}</v-icon>
                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <v-list v-else-if="role == 'Kasir'" prominent nav dense>
            <v-list-item
                v-for="item in itemsKasir"
                :key="item.title"
                link
                tag="router-link"
                :to="item.to"
            >
            <v-icon>{{ item.icon }}</v-icon>
                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>

        </v-navigation-drawer>
        <v-app-bar app fixed height="75px"
            color="blue darken">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <VSpacer />
            <!-- <v-toolbar-items>
                <v-btn text router tag="router-Link" to="/profile"><v-icon>mdi-account</v-icon></v-btn>
            </v-toolbar-items> -->
            <v-toolbar-items>
                <v-btn text router @click="logout"><v-icon>mdi-logout</v-icon></v-btn>
            </v-toolbar-items>
        </v-app-bar>
        <div class="fullheight pa-5">
            <router-view style="padding: 75px 0px 0px 0px"></router-view>
        </div>
    </div>
</template>
<script>
export default {
  name: 'dashboard-view',
  data () {
    return {
      drawer: true,
      role: '',
      nama: '',
      id: '',
      itemsPemilik: [
        { title: 'Profile', to: '/profile', icon: 'mdi-account' },
        { title: 'Pegawai', to: '/pegawai', icon: 'mdi-account-multiple' },
        { title: 'Menu', to: '/menu', icon: 'mdi-book-open-page-variant' },
        // { title: 'History Stok', to: '/historystok', icon: 'mdi-package-variant-closed' },
        // { title: 'Resep Menu', to: '/resep', icon: 'mdi-notebook' },
        { title: 'Transaksi', to: '/transaksi', icon: 'mdi-cash' },
        { title: 'Laporan', to: '/laporan', icon: 'mdi-chart-line' }
      ],

      itemsAdmin: [
        { title: 'Profile', to: '/profile', icon: 'mdi-account' },
        { title: 'Menu', to: '/menu', icon: 'mdi-book-open-page-variant' },
        // { title: 'History Stok', to: '/historystok', icon: 'mdi-package-variant-closed' },
        // { title: 'Resep Menu', to: '/resep', icon: 'mdi-notebook' },
        { title: 'Transaksi', to: '/transaksi', icon: 'mdi-cash' },
        { title: 'Laporan', to: '/laporan', icon: 'mdi-chart-line' }
      ],

      itemsKasir: [
        { title: 'Profile', to: '/profile', icon: 'mdi-account' },
        { title: 'Transaksi', to: '/transaksi', icon: 'mdi-cash' }
      ]
    }
  },
  methods: {
    logout () {
      localStorage.removeItem('id')
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('nama')
      console.log(localStorage.getItem('token'))
      this.$router.replace('/admin')
    },
    getrole () {
      this.role = localStorage.getItem('role')
    },
    getnama () {
      this.nama = localStorage.getItem('nama')
    },
    getid () {
      this.id = localStorage.getItem('id')
    }
  },
  mounted () {
    this.getrole()
    this.getnama()
    this.getid()
  }
}
</script>

<style scoped>
.fullheight {
    min-height: 100vh !important;
}
.router {
    text-decoration: none;
    color: black;
}
.v-list-item {
    text-align: center;
}
.title {
    padding-bottom: 10px;
}
</style>
