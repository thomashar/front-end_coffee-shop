<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Profile </h3>
        <v-card class="pt-8">
                <div class="ml-10 mr-7">
                  <div class="row">
                    <v-btn
                      class="mt-3"
                      color="deep-blue"
                      @click="dialogGambarShow(pegawais)">
                      Lihat Foto
                    </v-btn>
                    <v-file-input
                      class="custom-file-input mx-4"
                      type="file"
                      @change="saveFoto">
                    </v-file-input>
                  </div>
                </div>
                <v-text-field
                    class="mx-8"
                    label="Nama"
                    v-model="pegawais.nama_pegawai"
                    single-line
                ></v-text-field>
                <v-select
                    class="mx-8"
                    label="Jenis Kelamin"
                    v-model="pegawais.jenis_kelamin"
                    :items="kelamins"
                    :rules="[(v) => !!v || 'Jenis kelamin tidak boleh kosong']"
                ></v-select>
                <v-text-field
                    class="mx-8"
                    label="Telepon"
                    v-model="pegawais.hp_pegawai"
                    single-line
                ></v-text-field>
                <!-- <v-select
                    class="mx-8"
                    label="Jabatan"
                    v-model="pegawais.jabatan_pegawai"
                    :items="jabatans"
                    :rules="[(v) => !!v || 'Jabatan tidak boleh kosong']"
                ></v-select> -->
                <v-text-field
                    class="mx-8"
                    label="Email"
                    v-model="pegawais.email_pegawai"
                    single-line
                ></v-text-field>
                <v-checkbox
                    class="mx-8"
                    v-model="checkbox"
                    :label="`Change Password?`"
                ></v-checkbox>
                <v-text-field v-if="checkbox"
                    class="mx-8"
                    label="New Password"
                    v-model="new_pass"
                    single-line
                    type="password"
                ></v-text-field>
                <v-text-field v-if="checkbox"
                    class="mx-8"
                    label="New Password Confirmation"
                    v-model="new_pass_con"
                    single-line
                    type="password"
                ></v-text-field>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="save">
                        Save
                    </v-btn>
                </v-card-actions>
        </v-card>

        <v-dialog v-model="dialogGambar" max-width="400px">
          <v-card>
            <v-card-text class="font" style="padding-top:15px; margin-bottom:-15px">
              <div
                class="text--secondary"
                style="font-size: 15px; margin-bottom: 5px"
              >
                Gambar
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

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{error_message}}
        </v-snackbar>
    </v-main>
</template>

<script>
export default {
  name: 'profile-component',
  data () {
    return {
      checkbox: false,
      snackbar: false,
      dialogGambar: false,
      error_message: '',
      color: '',
      name: '',
      email: '',
      foto: [],
      new_pass: '',
      new_pass_con: '',
      namaTemp: '',
      pictTemp: null,
      pegawai: new FormData(),
      pegawais: [],
      jabatans: [
        'Pemilik',
        'Admin',
        'Kasir',
        'Pegawai'
      ],
      kelamins: [
        'Laki-laki',
        'Perempuan'
      ],
      deleteId: '',
      editId: ''
      // image: ''
    }
  },
  methods: {
    // imageChanged(e) {
    //     console.log(e.target.files[0])
    //     var fileReader = new FileReader()
    //     fileReader.readAsDataURL(e.target.files[0])

    //     fileReader.onload = (e) => {
    //         this.image = e.target.result
    //     }
    //     console.log(this.pegawais)
    // },
    readData () {
      const url = this.$api + '/pegawai/' + localStorage.getItem('id')
      this.$http.get(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.pegawais = response.data.data
      })
    },
    dialogGambarShow (pegawai) {
      this.pictTemp = this.$urlFoto + pegawai.foto_pegawai
      this.namaTemp = pegawai.nama_pegawai
      this.dialogGambar = true
    },
    saveFoto (file) {
      this.pegawai.append('foto_pegawai', file)
      const selfFoto = this.$api + '/pegawai/selfFoto/' + localStorage.getItem('id')
      this.$http.post(selfFoto, this.pegawai, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message
        this.color = 'green'
        this.snackbar = true
        this.load = false
        this.pegawais = response.data
        this.readData()
      }).catch(error => {
        this.error_message = error.response.data.message
        this.color = 'red'
        this.snackbar = true
        this.load = false
      })
    },
    onFileChange (event) {
    /*
    Set the local file variable to what the user has selected.
    */
      this.editedItem.gambar = event.target.files[0]
      console.log('di onfile change', this.editedItem.gambar)
      const reader = new FileReader()
      /*
    Add an event listener to the reader that when the file
    has been loaded, we flag the show preview as true and set the
    image to be what was read from the reader.
    */
      reader.addEventListener(
        'load',
        function () {
          this.showPreview = true
          this.imagePreview = reader.result
        }.bind(this),
        false
      )
      /*
    Check to see if the file is not empty.
    */
      if (this.editedItem.gambar) {
        /*
            Ensure the file is an image file.
        */
        if (/\.(jpe?g|png|gif)$/i.test(this.editedItem.gambar.name)) {
          console.log('loader', this.editedItem.gambar)
          /*
            Fire the readAsDataURL method which will read the file in and
            upon completion fire a 'load' event which we will listen to and
            display the image in the preview.
            */
          reader.readAsDataURL(this.editedItem.gambar)
        }
      }
    },
    save () {
      if (this.checkbox !== true) {
        const userdata = {
          nama_pegawai: this.pegawais.nama_pegawai,
          jenis_kelamin: this.pegawais.jenis_kelamin,
          email_pegawai: this.pegawais.email_pegawai,
          hp_pegawai: this.pegawais.hp_pegawai,
          alamat_pegawai: this.pegawais.alamat_pegawai,
          jabatan_pegawai: this.pegawais.jabatan_pegawai
        }

        const urlNoPass = this.$api + '/pegawai/selfNoPass/' + localStorage.getItem('id')
        this.$http.put(urlNoPass, userdata, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.error_message = response.data.message
          this.color = 'green'
          this.snackbar = true
          this.load = false
          this.pegawais = response.data
          this.readData()
          // this.$router.push({
          //   name: 'Login'
          // })
        }).catch(error => {
          this.error_message = error.response.data.message
          this.color = 'red'
          this.snackbar = true
          this.load = false
        })
      } else if (this.new_pass === this.new_pass_con && this.checkbox === true) {
        const userdata = {
          nama_pegawai: this.pegawais.nama_pegawai,
          jenis_kelamin: this.pegawais.jenis_kelamin,
          email_pegawai: this.pegawais.email_pegawai,
          hp_pegawai: this.pegawais.hp_pegawai,
          alamat_pegawai: this.pegawais.alamat_pegawai,
          jabatan_pegawai: this.pegawais.jabatan_pegawai,
          old_pass: this.new_pass,
          password: this.new_pass_con
        }

        const url = this.$api + '/pegawai/self/' + localStorage.getItem('id')
        this.$http.put(url, userdata, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        }).then(response => {
          this.error_message = response.data.message
          this.color = 'green'
          this.snackbar = true
          this.load = false
          this.pegawais = response.data
          this.readData()
          this.$router.push({
            name: 'login'
          })
        }).catch(error => {
          this.error_message = error.response.data.message
          this.color = 'red'
          this.snackbar = true
          this.load = false
        })
      }
    }
  },
  mounted () {
    this.readData()
  }
}
</script>
