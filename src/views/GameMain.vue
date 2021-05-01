
<template>
  <v-container>
    <v-row>
      <v-col> </v-col>
    </v-row>

    <v-row>
      <v-col v-for="m in encounter" v-bind:key="m.name">
        <monster :monster="m" :bgActive="bgActive"></monster>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <v-row>
      <v-col>
        <game-stage
          :bgMessage="bgMessage"
          :text="displayText"
          :combatLog="combatLog"
          :outOfCombat="outOfCombat"
        ></game-stage>
      </v-col>
      <v-col>
        <game-char
          :toon="toon"
          @action="gameRound"
          @lockMove="lockMove = true"
          :bgActive="bgActive"
          :equip="equip"
          :inventory="inventory"
        ></game-char>
      </v-col>
    </v-row>

    <v-row> </v-row>
  </v-container>
</template>

<script>
import GameStage from "../components/GameStage";
import GameChar from "../components/GameChar";
import Monster from "../components/Monster";

export default {
  components: {
    GameStage,
    GameChar,
    Monster,
  },
  data() {
    return {
      bgMessage: "",
      bgActive: "",
      displayText: "",
      combatLog: [],
      lockMove: false,
      timeout: 3000,
      stage: 0,
      target: null,
      encounter: [],
      xpSlope: 20,
      outOfCombat: true,
      inventory: [{ name: "Unarmed", ap: 5 }],
      equip: null,

      cPlayer: null,
      wPlayer: null,
      showTodo: true,

      toon: {
        name: "Rambo",
        level: 1,
        xp: 0,
        points: 1,
        gold: 0,
        hp: null,
        ac: null,
        ap: null,
        selectedWeapon: null,
        defending: false,

        strength: 40,
        dexterity: 8,
        willpower: 8,
        vigor: 8,
        // damage: null,
      },
      // goblin: {
      //   name: "Goblin",
      //   hp: null,
      //   ac: null,
      //   ap: null,
      //   defending: false,
      //   damage: null,
      //   strength: 10,
      //   dexterity: 12,
      //   willpower: 6,
      //   vigor: 8,
      // },
      monsters: [
        {
          name: "Goblin",
          xp: 10,
          gold: 50,
          active: false,
          targeted: false,
          hp: null,
          ac: null,
          ap: null,
          defending: false,
          damage: null,
          strength: 20,
          dexterity: 4,
          willpower: 6,
          vigor: 8,
        },
        {
          name: "Bugbear",
          xp: 20,
          gold: 100,
          active: false,
          targeted: false,
          hp: null,
          ac: null,
          ap: null,
          defending: false,
          damage: null,
          strength: 15,
          dexterity: 6,
          willpower: 6,
          vigor: 8,
        },
      ],
    };
  },

  methods: {
    pharc(monster, timeout) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let damage = this.rollDamage(monster.ap);
          this.resolveAction(damage, monster, this.toon);

          this.timeout += 3000;
          resolve(damage);
        }, timeout);
      });
    },
    gameRound(damage) {
      // init
      if (!this.target) {
        this.target = this.encounter[0];
      }
      this.lockMove = true;
      this.timeout = 3000;

      this.lock();

      // Player goes first
      this.resolveAction(damage, this.toon, this.target);
      this.endTurn();
      
      

      // then monsters
      this.encounter.forEach((monster) => {
        this.monsterTurn(monster);
        this.timeout += 3000;
        this.endTurn();
      });

      
    },
    monsterTurn(monster) {
      setTimeout(() => {
        monster.active = true;
        monster.defending = false;

        let monsterIndex = this.encounter.indexOf(monster);
        if (monsterIndex > 0) {
          this.encounter[monsterIndex - 1].active = false;
        }

        let roll = Math.floor(Math.random() * 20);

        console.log(roll);
        let damage = -1;

        if (roll < 6) {
          monster.defending = true;
        } else if (roll == 20) {
          damage = monster.ap;
        } else {
          // roll damage
          damage = this.rollDamage(monster.ap);
        }

        // needs a check because of setTimeouts
        if (monster.hp != 0) {
          this.resolveAction(damage, monster, this.toon);
        }

        console.log(this.timeout + "timeout");
      }, this.timeout);
    },
    resolveAction(damage, wielder, victim) {
      // check if attack or defend
      if (wielder.defending) {
        this.combatLog.push(`${wielder.name} defends!`);
        this.bgMessage = "blue";
      } else {
        console.log(victim.ac + "ac");
        damage -= victim.ac;
        console.log(damage + " damage");

        // If damage is less than 0, make it 0
        // Apply defense if true
        damage < 0
          ? (damage = 0)
          : victim.defending
          ? (damage -= Math.floor((damage / 100) * 25))
          : damage;
        console.log(
          damage + ` after defending (defending = ${victim.defending})`
        );

        // Update descriptions
        this.bgMessage = "red";
        !damage
          ? this.combatLog.push(
              `${wielder.name} attacks ${victim.name} but misses and deals no damage!`
            )
          : this.combatLog.push(
              `${wielder.name} attacks ${victim.name} for ${damage}`
            );

        victim.hp - damage <= 0 ? (victim.hp = 0) : (victim.hp -= damage);
      }
      this.displayText = this.combatLog.slice().reverse()[0];
      if (victim.hp == 0) {
        this.hollow(victim);
      }
    },
    endTurn() {
      setTimeout(() => {
        this.bgMessage = "";

        this.displayText = "";
      }, this.timeout - 100);
    },
    lock() {
      setTimeout(() => {
        this.lockMove = false;
        this.encounter.forEach((monster) => {
          monster.active = false;
        });
      }, this.encounter.length * 4000);
    },
    checkWin() {

      if (!this.encounter.length) {
        this.displayText = 'Victory!';
        this.outOfCombat = true;
        
      }
    },
    hollow(victim) {
      if (victim.level) {
        // player dies
        victim;
      } else {
        setTimeout(() => {
          this.combatLog.push(`${victim.name} is dead!`);
          this.encounter.splice(this.encounter.indexOf(victim), 1);

          // autotarget
          this.target = this.encounter[0];

          // reward
          this.toon.xp += victim.xp;
          this.toon.gold += this.rollDamage(victim.gold);
          this.combatLog.push(`${this.toon.name} gained ${victim.xp} xp`);
          
          this.kindling();
          this.checkWin();
        }, 1500);
      }
    },
    kindling() {
      if (this.toon.xp >= this.xpSlope) {
        this.toon.level += 1;
        this.toon.points += 2;
        this.xpSlope *= 2;
      }
    },
    seedEncounter(howMany, index) {
      for (let i = 0; i < howMany; i++) {
        let monster = Object.assign({}, this.monsters[index]);
        this.encounter.push(monster);
      }
    },
    rollDamage(n) {
      let r = Math.floor(Math.random() * Math.floor(n));
      r < n / 2 ? (r = Math.floor(n / 2)) : r;
      // lowest roll is half of ap
      return r;
    },
    percent(percent, hp) {
      return (hp / 100) * percent;
    },
  },
  created() {
    this.seedEncounter(1, 0);
    this.seedEncounter(1, 1);
  },
};
</script>

<style>
.highlight {
  background-color: rgba(0, 255, 255, 0.288);
}

</style>
