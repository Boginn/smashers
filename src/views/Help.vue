<template>
  <v-container>
    <v-card>
      <v-card-text class="panel-bg pa-5" style="text-align: center">
         <router-link to="/#" class="okay">
         <div class="white--text">

        <h2>
          You can either attack or defend, unless you are a pacifist priest and
          those don't get any help.
        </h2>
        <br>
        <h3>
          Target an enemy by clicking on it. Select a weapon to use and press
          attack.
        </h3>
        <h3>
          Remember to assign your points when you level up and to spend your
          hard earned gold at the shop.
        </h3>
        <br>
        <h4>AP is Attack Power. AC is Armor Class. HP is Health Points.</h4>
        <h5>... but you already knew that... right?</h5>
         </div>
      </router-link>
      </v-card-text>
      
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Help",
  components: {},

  data() {
    return {};
  },
};
</script>

<style>
.okay {
text-decoration: none;

}
</style>
