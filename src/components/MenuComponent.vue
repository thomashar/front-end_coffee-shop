<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Menu </h3>

        <!-- <h5> Showing :</h5>
        <v-select
          :items="showMenu"
          label="Show Menu"
          item-text="text"
          @click="checkMenu(showMenu)"
          solo
        ></v-select> -->
          <v-card>
            <v-card-title>
              <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  @keydown.enter="readNamaMenu(search)"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn color="success" dark @click="dialog = true">
                  Tambah
              </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="menus" :search="search">
              <template v-slot:[`item.foto_menu`]="{ item }">
                <v-icon small class="mr-2" @click="dialogGambarShow(item)">
                  mdi-camera
                </v-icon>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                  <v-btn small class="mr-2" @click="uploadHandler(item)">
                    Upload Foto
                  </v-btn>
                  <v-icon small class="mr-2" @click="editHandler(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon v-if="item.is_Deleted === 0" small class="mr-2" @click="deleteHandler(item.id)">
                    mdi-delete
                  </v-icon>
                  <v-icon v-else-if="item.is_Deleted === 1" small class="mr-2" @click="restoreHandler(item.id)">
                    mdi-restore
                  </v-icon>
              </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{inputType}} Menu</span>
                </v-card-title>
                <v-card-text>
                  <!-- <v-avatar
                    class="profile mx-10"
                    color="grey"
                    size="164"
                    tile
                  >
                    <v-img :src= "urlFoto">
                    </v-img>
                  </v-avatar>
                    <v-file-input
                      v-model="pictTemp"
                      accept=".png, .jpeg, .jpg"
                      hint="File extentions (.png, .jpg, .jpeg)"
                      placeholder="Upload Foto Menu"
                      prepend-icon="mdi-camera"
                      outlined
                      filled
                      class="my-3 mx-10"
                      @click:clear="urlFoto=''"
                      @change="checkInput()"/> -->

                    <v-container>
                        <v-text-field
                            v-model="form.nama_menu"
                            label="Nama Menu"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.harga_menu"
                            label="Harga"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.deskripsi_menu"
                            label="Deskripsi"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="form.jenis_menu"
                            :items="jenisMenu"
                            :rules="[(v) => !!v || 'Jenis menu tidak boleh kosong']"
                            label="Jenis"
                            required
                        ></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="setForm">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogUpload" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Upload Foto Menu</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                      <v-avatar
                        class="profile mx-10"
                        color="grey"
                        size="164"
                        tile
                      >
                        <v-img :src= "urlFoto">
                        </v-img>
                      </v-avatar>
                        <v-file-input
                          v-model="pictTemp"
                          accept=".png, .jpeg, .jpg"
                          hint="File extentions (.png, .jpg, .jpeg)"
                          placeholder="Upload Foto Menu"
                          prepend-icon="mdi-camera"
                          outlined
                          filled
                          type="file"
                          class="my-3 mx-10 custom-file-input"
                          />
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="uploadImg(pictTemp)">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!!!</span>
                </v-card-title>
                <v-card-text v-if="statusData === 'Hapus'">
                    Anda yakin ingin menghapus menu?
                </v-card-text>
                <v-card-text v-else-if="statusData === 'Restore'">
                    Anda yakin ingin memulihkan menu?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="reverseData">
                        Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogGambar" max-width="400px">
          <v-card>
            <v-card-text class="font" style="padding-top:15px; margin-bottom:-15px">
              <div
                class="text--secondary"
                style="font-size: 15px; margin-bottom: 5px"
              >
                Foto
              </div>
              <p
                class="font"
                style="font-size: 28px; font-weight: 600; color: black"
              >
                {{ namaTemp }}
              </p>
            </v-card-text>
            <v-img :src="pictTemp" height="310"> </v-img>
          </v-card>
        </v-dialog>

        <!-- <v-dialog v-model="dialogUpload" persistent max-width="600px" @keydown.esc="dialogUpload = false">
            <v-card>
                <v-card-title>
                    <span class="headline">Upload Foto Menu</span>
                </v-card-title>
                <img :src="this.$api + menus.foto_menu" width="300" height="200" />
                <v-spacer></v-spacer>
                <input type="file" accept="image" @change="imageChanged">
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialogUpload = false">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="uploadImg">
                        Upload Photo
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog> -->

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{error_message}}
        </v-snackbar>
    </v-main>
</template>

<script>
export default {
  name: 'menu-component',
  data () {
    return {
      inputType: 'Tambah',
      radioGroup: 'Show All',
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      showed: '',
      namaTemp: '',
      pictTemp: '',
      urlFoto: '',
      statusData: '',
      search: null,
      dialog: false,
      dialogConfirm: false,
      dialogUpload: false,
      dialogGambar: false,
      headers: [
        {
          text: 'Nama Menu',
          align: 'start',
          sortable: true,
          value: 'nama_menu'
        },
        { text: 'Harga', value: 'harga_menu' },
        { text: 'Foto', value: 'foto_menu' },
        { text: 'Deskripsi', value: 'deskripsi_menu' },
        { text: 'Jenis', value: 'jenis_menu' },
        { text: 'Actions', value: 'actions' }
      ],
      // showMenu: [
      //   { text: 'Show All', value: 'Show All' },
      //   { text: 'Show On Menu', value: 'Show On Menu' },
      //   { text: 'Show Deleted', value: 'Show Deleted' }
      // ],
      jenisMenu: [
        'Kopi',
        'Non-Kopi',
        'Makanan'
      ],
      menu: new FormData(),
      menus: [],
      form: {
        nama_menu: null,
        harga_menu: null,
        foto_menu: null,
        deskripsi_menu: null,
        jenis_menu: null
      },
      restoreId: '',
      deleteId: '',
      editId: '',
      uploadId: '',
      uploadNama_menu: '',
      foto_menu: []
    }
  },
  methods: {
    // read data menu
    readData () {
      const url = this.$api + '/menu'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.menus = response.data.data
      })
    },
    // read not deleted
    readNotDeleted () {
      const url = this.$api + '/menuNotDeleted'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.menus = response.data.data
      })
    },
    // read deleted
    readDeleted () {
      const url = this.$api + '/menuDeleted'
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.menus = response.data.data
      })
    },
    // read data menu
    readNamaMenu (searchName) {
      const url = this.$api + '/menuByName/' + searchName
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.menus = response.data.data
      })
    },
    dialogGambarShow (menu) {
      this.pictTemp = this.$urlFoto + menu.foto_menu
      this.namaTemp = menu.nama_menu
      this.dialogGambar = true
    },
    setForm () {
      if (this.inputType === 'Tambah') {
        this.save()
      } else {
        this.update()
      }
    },
    // checkMenu (showMenu) {
    //   if (showMenu.value === 'Show All') {
    //     this.readData()
    //   } else if (showMenu.value === 'Show On Menu') {
    //     this.readNotDeleted()
    //   } else if (showMenu.value === 'Show Deleted') {
    //     this.readDeleted()
    //   }
    // },
    checkInput () {
      if (this.pictTemp != null) {
        this.urlFoto = URL.createObjectURL(this.pictTemp)
      }
    },
    // simpan data produk
    save () {
      this.menu.append('nama_menu', this.form.nama_menu)
      this.menu.append('harga_menu', this.form.harga_menu)
      this.menu.append('deskripsi_menu', this.form.deskripsi_menu)
      this.menu.append('jenis_menu', this.form.jenis_menu)

      const url = this.$api + '/menu'
      this.load = true
      this.$http.post(url, this.menu, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.readData() // mengambil data
        this.resetForm()
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },

    // imageChanged (e) {
    //   console.log(e.target.files[0])
    //   const fileReader = new FileReader()
    //   fileReader.readAsDataURL(e.target.files[0])

    //   fileReader.onload = (e) => {
    //     this.foto_menu = e.target.result
    //   }
    // },
    uploadImg (file) {
      this.menu.append('foto_menu', file)
      const url = this.$api + '/menu/upimg/' + this.uploadId
      this.$http.post(url, this.menu, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.readData() // mengambil data
        this.resetForm()
        this.inputType = 'Tambah'
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },

    // ubah data produk
    update () {
      this.menu.append('nama_menu', this.form.nama_menu)
      this.menu.append('harga_menu', this.form.harga_menu)
      this.menu.append('deskripsi_menu', this.form.deskripsi_menu)
      this.menu.append('jenis_menu', this.form.jenis_menu)

      const url = this.$api + '/menu/' + this.editId
      this.load = true
      this.$http.put(url, this.menu, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.readData() // mengambil data
        this.resetForm()
        this.inputType = 'Tambah'
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    // soft delete data produk
    deleteData () {
      const url = this.$api + '/menu/softDelete/' + this.deleteId
      this.load = true
      this.$http.put(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.readData() // mengambil data
        this.resetForm()
        this.inputType = 'Tambah'
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    // restore data produk
    restoreData () {
      const url = this.$api + '/menu/restore/' + this.deletedId
      this.$http.put(url, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.close()
        this.readData() // mengambil data
        this.resetForm()
        this.inputType = 'Tambah'
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    reverseData () {
      if (this.statusData === 'Restore') {
        this.restoreData()
      } else {
        this.deleteData()
      }
    },
    uploadHandler (item) {
      this.uploadId = item.id
      this.uploadNama_menu = item.nama_menu
      this.dialogUpload = true
    },
    editHandler (item) {
      this.inputType = 'Edit'
      this.editId = item.id
      this.form.nama_menu = item.nama_menu
      this.urlFoto = 'http://127.0.0.1:8000/menu_picture' + item.pictTemp
      this.form.harga_menu = item.harga_menu
      this.form.foto_menu = item.foto_menu
      this.form.deskripsi_menu = item.deskripsi_menu
      this.form.jenis_menu = item.jenis_menu
      this.dialog = true
    },
    deleteHandler (id) {
      this.deleteId = id
      this.dialogConfirm = true
      this.statusData = 'Hapus'
    },
    restoreHandler (id) {
      this.restoreId = id
      this.dialogConfirm = true
      this.statusData = 'Restore'
    },
    close () {
      this.resetForm()
      this.readData()
      this.dialog = false
      this.dialogConfirm = false
      this.dialogUpload = false
      this.urlFoto = ''
      this.fileFoto = null
      this.inputType = 'Tambah'
    },
    cancel () {
      this.resetForm()
      this.readData()
      this.dialog = false
      this.dialogConfirm = false
      this.dialogTambah = false
      this.dialogUpload = false
      this.urlFoto = ''
      this.fileFoto = null
      this.inputType = 'Tambah'
    },
    resetForm () {
      this.form = {
        nama_menu: null,
        harga_menu: null,
        foto_menu: [],
        deskripsi_menu: null,
        unit_menu: null,
        jenis_menu: null
      }
      this.$forceUpdate()
    }
  },
  computed: {
    formTitle () {
      return this.inputType
    }
  },
  mounted () {
    this.readData()
  }
}
</script>
