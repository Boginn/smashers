<template>
  <v-card @click="$parent.target = monster" >

    <v-card-text v-bind:class="{ highlight: monster.active }" >
      <h1 class="blue--text">{{ monster.name }}</h1>
      <br />
      <h1 :class="monster.hp < $parent.percent(30, maxHealth) ? 'red--text' : 'green--text'">
        Health: {{ monster.hp }}
      </h1>
      <v-row>
<v-col>

      <h2>AP: estimate</h2>
      <h2>AC: estimate</h2>
</v-col>

      <div v-if="monster.defending"><img height="50px" src="../assets/shield.png" alt=""></div>
<v-col>
  <span v-if="$parent.target">
  <img v-if="$parent.target.name == monster.name" src="../assets/crosshair.png" height="50px" />
     </span>
  
</v-col>
</v-row>
    </v-card-text>

  </v-card>
</template>

<script>

export default {

  props: {
    bgActive: String,
    monster: Object,
  },
  data: function() {
    return {
      ready: false,
    };
  },
computed: {
    maxHealth() {
        return this.monster.vigor*2;
    },
    armorClass() {
        return Math.floor(this.monster.dexterity*1.5);
    },
        attackPower() {
      return Math.floor(this.monster.strength + this.monster.dexterity / 2);
    },

},
  methods: {
     attack() {

      this.toon.defending = false;

        let damage = this.$parent.rollDamage(this.monster.ap);
        console.log(this.monster.ap + "MONSTER ap")
      console.log(damage + " MONSTER roll");



      this.$emit("action", damage);





     
    },
    defend() {

      this.toon.defending = true;

      this.$emit("action", false);
    },

  },
  created() {

    this.monster.hp = this.maxHealth;
    this.monster.ac = this.armorClass;
    this.monster.ap = this.attackPower;
    this.ready = true;
  },
};
</script>

<style>

</style>
