<template>
  <div class="notifications">
    <h1>This is notifications page</h1>
  </div>
</template>

<script>
 const fb = require('../firebaseConfig.js')
 fb.usersCollection.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data().what}`);
            });
        })
export default {
  
}
</script>