<template>
  <v-card @click="$parent.target = monster">
    <v-card-text
      v-bind:class="{ highlight: monster.active }"
      class="monster-bg white--text"
    >
      <v-row>
        <v-col>
          <v-progress-linear
            v-model="progressHp"
            :buffer-value="progressMaxHp"
            color="green"
            background-color="red"
          ></v-progress-linear>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h1 class="yellow--text">{{ monster.name }}</h1>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <h2>AP: {{ attackPower }}</h2>
          <h2>AC: {{ armorClass }}</h2>
          <h2>HP: {{ maxHealth }}</h2>
        </v-col>

        <div v-if="monster.defending">
          <img height="50px" src="../assets/shield.png" alt="" />
        </div>
        <v-col>
          <span v-if="$parent.target">
            <img
              style="float:right; display: inline-block; overflow: auto;"
              v-if="$parent.target.id == monster.id"
              src="../assets/crosshair.png"
              height="50px"
            />
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
      return this.monster.vigor * 2;
    },
    armorClass() {
      return Math.floor(this.monster.dexterity * 1.5);
    },
    attackPower() {
      return Math.floor(this.monster.strength + this.monster.dexterity / 2);
    },
    progressHp() {
      return this.monster.hp * 3;
    },
    progressMaxHp() {
      return this.maxHealth * 3;
    },
  },
  methods: {
    attack() {
      this.monster.defending = false;


 

      let damage = this.$parent.rollDamage(this.monster.ap);
      console.log(this.monster.ap + "MONSTER ap");
      console.log(damage + " MONSTER roll");

      this.$emit("action", damage);
    },
    defend() {
      this.monster.defending = true;

      // heal

      let roll = this.$parent.rollDamage(this.monster.willpower);
      if (roll) {
        this.monster.hp += roll;
      }
      this.$parent.combatLog.push(`${this.monster.name} heals for ${roll}!`);

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

<style scoped>
.v-card {
  /* background: rgba(0, 73, 182, 0.925); */
}
</style>
