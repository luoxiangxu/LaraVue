<template>
    <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="card" v-if="$gate.isAdmin()">
              <div class="card-header">
                <h3 class="card-title pt-2">Users Table</h3>

                <div class="card-tools">
                    <button class="btn btn-success" @click="newModel">Add New <i class="fas fa-user-plus"></i></button>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Regitsted At</th>
                      <th>Modify</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users.data" :key="user.id">
                      <td>{{user.id}}</td>
                      <td>{{user.name}}</td>
                      <td>{{user.email}}</td>
                      <td><span class="tag tag-success">{{user.type | upText}}</span></td>
                      <td>{{user.created_at | myDate}}</td>
                      <td>
                          <a href="#" @click="edit(user)">
                              <i class="fa fa-user-edit"></i>
                          </a>
                          /
                          <a href="#" @click="deleteUser(user.id)">
                              <i class="fa fa-trash-alt red"></i>
                          </a>  
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
              <div class="card-footer">
                <pagination :data="users" @pagination-change-page="getResults"></pagination>
              </div>
            </div>
            <!-- /.card -->
          </div>
        </div>
        <!-- Modal -->
            <div class="modal fade" id="addNew" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 v-show="!editMode" class="modal-title" id="addNewLabel">Add New User</h5>
                    <h5 v-show="editMode" class="modal-title" id="addNewLabel">Update User</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form @submit.prevent="editMode ? updateUser() : createUser()">
                <div class="modal-body">
                    <div class="form-group">
                      <input v-model="form.name" type="text" name="name" placeholder="Name"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                      <has-error :form="form" field="name"></has-error>
                    </div>

                    <div class="form-group">
                      <input v-model="form.email" type="email" name="email" placeholder="Email"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                      <has-error :form="form" field="email"></has-error>
                    </div>

                    <div class="form-group">
                      <textarea v-model="form.bios" type="text" name="bios" placeholder="Short bios for user (optional)"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('bios') }"></textarea>
                        <has-error :form="form" field="bios"></has-error>
                    </div>

                    <div class="from-group">
                      <select class="form-control" name="type" v-model="form.type" :class="{ 'is-invalid': form.errors.has('type') }">
                        <option value="" selected disabled>Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">Standart user</option>
                        <option value="author">Author</option>
                      </select>
                      <has-error :form="form" field="type"></has-error>
                    </div>
                    
                    <div class="form-group pt-3">
                      <input v-model="form.password" type="password" name="password" placeholder="Password"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                      <has-error :form="form" field="password"></has-error>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button v-show="!editMode" type="submit" class="btn btn-primary">Create</button>
                    <button v-show="editMode" type="submit" class="btn btn-success">Save</button>
                </div>
                </form>
                </div>
            </div>
            </div>
    </div>
</template>

<script>
    export default {
        data () {
          return{
            editMode : false,
            users: {},
            form : new Form({
              id:'',
              name:'',
              email:'',
              password:'',
              type:'',
              bios:'',
              photo:''
            })
          }
        },
        methods: {
          updateUser(){
            this.$Progress.start();
            this.form.put('api/user/'+ this.form.id)
            .then(()=>{
              $('#addNew').modal('hide');
              Toast.fire({
                icon: 'success',
                title: 'User Update successfully'
              });
              Fire.$emit('reloadUser');
              this.$Progress.finish();
            })
            .catch(()=>{
              this.$Progress.fail();
            })
          },
          newModel(){
            this.editMode = false;
            $('#addNew').modal('show');
            this.form.reset();
          },
          edit(user){
            this.editMode = true;
            $('#addNew').modal('show');
            this.form.fill(user);
          },
          loadUsers(){
            if(this.$gate.isAdmin){
              axios.get('api/user').then(({data}) => (this.users = data));
            }
            
          },
          createUser(){
            this.$Progress.start();
            this.form.post('api/user')
            .then(()=>{
              $('#addNew').modal('hide');
              Toast.fire({
                icon: 'success',
                title: 'User created successfully'
              });
              Fire.$emit('reloadUser');
              this.$Progress.finish();
            })
            .catch(()=>{
              this.$Progress.fail();
            })
          },
          deleteUser(id){
            this.$Progress.start();
            Swal.fire({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                this.form.delete('api/user/'+ id).then(()=>{
                  if (result.value) {
                    Swal.fire(
                      'Deleted!',
                      'Your file has been deleted.',
                      'success'
                    )
                    this.$Progress.finish();
                    Fire.$emit('reloadUser');
                  }
                }).catch(()=>{
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'You didnt have the authorize!',
                    footer: ''
                  })
                  this.$Progress.fail();
                });
                
            })
          },
          getResults(page = 1) {
            axios.get('api/user?page=' + page)
              .then(response => {
                this.users = response.data;
              });
          }
        },
        created() {
            Fire.$on('Searching', ()=>{
              let query = this.$parent.search;
              axios.get('api/findUser?q=' + query)
              .then((response)=>{
                this.users = response.data;
              })
              .catch(()=>{

              })
            });
            this.loadUsers();
            Fire.$on('reloadUser',()=> {
              this.loadUsers()
            });
            this.getResults();
        }
    }
</script>
