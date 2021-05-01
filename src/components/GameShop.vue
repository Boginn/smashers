<template>
  <v-container>
    <v-row>
      <v-col>
        <ul v-for="w in weapons" v-bind:key="w.name">
          <li @click="buyWeapon(w)">
            {{ w.name }}
            <p>{{ w.cost }} g</p>
          </li>
        </ul>
      </v-col>
      <v-col>
        <ul v-for="a in armor" v-bind:key="a.name">
          <li @click="buyArmor(a)">
            {{ a.name }}
            <p>{{ a.cost }} g</p>
          </li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      weapons: [
        { name: "Club", ap: 15, uses: 20, maxUses: 20, cost: 100 },
        { name: "Crossbow", ap: 20, uses: 10, maxUses: 10, cost: 100 },
        { name: "Falchion", ap: 25, uses: 3, maxUses: 3, cost: 100 },
        { name: "Halberd", ap: 45, uses: 3, maxUses: 3, cost: 100 },
        { name: "Moonlight Sword", ap: 88, uses: 1, maxUses: 1, cost: 100 },
      ],
      armor: [
        { name: "Loincloth", ac: 5, cost: 100 },
        { name: "Chain Mail", ac: 15, cost: 100 },
        { name: "Onion Suit", ac: 25, cost: 100 },
        { name: "Impenetranium Attire", ac: 50, cost: 100 },
      ],
    };
  },
  methods: {
    buyWeapon(w) {
      this.$emit("boughtWeapon", w);
      this.weapons.splice(this.weapons.indexOf(w), 1);
    },
    buyArmor(a) {
      this.$emit("boughtArmor", a);
      this.armor.splice(this.armor.indexOf(a), 1);
    },
  },
};
</script>

<style>
.highlight {
  background-color: rgba(0, 255, 255, 0.288);
}
</style>
