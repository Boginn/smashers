<template>
  <v-card @click="$parent.target = monster">
    <v-card-text
      class="white--text"
      :style="`${monster.background}`"
      v-bind:class="{ highlight: monster.active }"
    >
      <v-row>
        <v-col>
          <v-progress-linear
            height="15"
            v-model="progressHp"
            :buffer-value="progressMaxHp"
            color="green"
            background-color="red"
          ></v-progress-linear>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h1 class="yellow--text fontshadow">{{ monster.name }}</h1>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <h2 class="fontshadow ">AP: {{ attackPower }}</h2>
          <h2 class="fontshadow ">AC: {{ armorClass }}</h2>
          <h2 class="fontshadow ">HP: {{ maxHealth }}</h2>
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
      if (this.maxHealth >= 100) {
        return this.monster.hp / 3;
      }
      return this.monster.hp;
    },
    progressMaxHp() {
      if (this.maxHealth >= 100) {
        return this.maxHealth / 3;
      }
      return this.maxHealth;
    },
  },
  methods: {},
  created() {
    this.monster.hp = this.maxHealth;
    this.monster.ac = this.armorClass;
    this.monster.ap = this.attackPower;
    this.ready = true;
  },
};
</script>

<style scoped>
.highlight {
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 0.95) 0%,
    rgba(8, 21, 63, 0.95) 24%,
    rgba(9, 20, 121, 0.8) 66%
  );
  border: 0.5px dashed white;
}
.monsterbg {
  background: linear-gradient(
    120deg,
    rgba(2, 2, 1, 0.95) 10%,
    rgba(139, 101, 31, 0.95) 33%,
    rgba(121, 9, 9, 0.95) 80%
  );
  /* background-color: rgba(97, 23, 0, 0.925); */
}
</style>
