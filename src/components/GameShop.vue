<template>
  <v-container>
    <v-row>
     <v-col>
       <v-btn block @click="buyHealth"><h3> Some Health  |</h3>
            <h4> | 100 g</h4></v-btn>
     </v-col>
      <v-col>
        <div v-for="w in weapons" v-bind:key="w.name">
          <v-card>
          <v-btn block @click="buyWeapon(w)">
            <h3> {{ w.name }} |</h3>
            <h4> | {{ w.cost }} g</h4>
          </v-btn>
          </v-card>
        </div>
      </v-col>
      <v-col>
        <div v-for="a in armor" v-bind:key="a.name">
          <v-card>
          <v-btn block @click="buyArmor(a)">

           <h3> {{ a.name }} |</h3>
            <h4> | {{ a.cost }} g</h4>
          </v-btn>
            </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>




<script>
export default {
  props: {
    toonGold: Number,
    text: String,
  },
  data() {
    return {
      weapons: [
        {name: "Club", ap: 15, uses: 20, maxUses: 20, cost: 50 },
        {name: "Crossbow", ap: 20, uses: 10, maxUses: 10, cost: 75 },
        {name: "Falchion", ap: 35, uses: 3, maxUses: 3, cost: 225 },
        {name: "Halberd", ap: 45, uses: 3, maxUses: 3, cost: 350 },
        {name: "Death Star", ap: 99, uses: 1, maxUses: 1, cost: 1000 },
      ],
      armor: [
        {name: "Loincloth", ac: 5, cost: 15 },
        {name: "Chain Mail", ac: 15, cost: 100 },
        {name: "Onion Suit", ac: 25, cost: 250 },
        {name: "Impenetranium Attire", ac: 50, cost: 1000 },
      ],
    };
  },
  methods: {
    buyWeapon(w) {

      if(w.cost <= this.toonGold) {
        this.$emit("boughtWeapon", w);
      

      } else {
        this.$emit('displayText', "You don't have enough gold!");
        
      }
    },
    buyArmor(a) {
      if(a.cost <= this.toonGold) {
      this.$emit("boughtArmor", a);
      }  else {
        this.$emit('displayText', "You don't have enough gold!");
        
      }
    },
    buyHealth() {
      var cost = 50;
              if(cost <= this.toonGold) {
                this.$emit("boughtHealth", cost);
       
              }  else {
        this.$emit('displayText', "You don't have enough gold!");
        
      }
    }
  },
};
</script>

<style>
ul {
  list-style: none;
}
</style>
