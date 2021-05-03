<template>
  <v-container>
    <v-card>
      <v-card-text class="panel-bg pa-5" style="text-align: center">
        <router-link to="/#" class="okay">
          <div v-html="helpHTML" class="white--text"></div>
        </router-link>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Help",
  components: {},
  computed: {
    helpHTML() {
      return (
        `<h2>
          ${this.title}
        </h2><br>` +
        `<h3>
          ${this.help}
        </h3>` +
        `<h3>
          ${this.hint}
        </h3><br>` +
        `<h4>
          ${this.legacy}
        </h4>` +
        `<h5>
          ${this.ps}
        </h5>`
      );
    },
  },

  data() {
    return {
      title: `You can either attack or defend, unless you are a pacifist priest and
          those don't need any help.`,

      help: `Target an enemy by clicking on it. Select a weapon to use and press
          attack.`,
      hint: `Remember to assign your points when you level up and to spend your
          hard earned gold at the shop.`,
      legacy: `AP is Attack Power. AC is Armor Class. HP is Health Points.`,
      ps: `... but you already knew that... right?`,
    };
  },
};
</script>

<style>
.okay {
  text-decoration: none;
}
</style>
