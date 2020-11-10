exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('incidents')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('incidents').insert([
        {
          state: 'Washington',
          city: 'Olympia',
          desc:
            'Footage shows a few individuals break off from a protest to smash City Hall windows. Protesters shout at vandals to stop.\n\nPolice then arrive. They arrest multiple individuals near the City Hall windows, including one individual who appeared to approach the vandals in an effort to defuse the situation.\n\nPolice fire tear gas and riot rounds at protesters during the arrests. Protesters become agitated.\n\nAfter police walk arrestee away, protesters continue to shout at police. Police respond with a second bout of tear gas and riot rounds.\n\nA racial slur can be heard shouted, although it is unsure who is shouting.',
          title: 'Police respond to broken windows with excessive force',
          date: '2020-05-31',
          id: 'wa-olympia-1',
          lat: 47.0417,
          long: -122.8959,
          continuum: "non_lethal",
          verbalization: false,
          empty_hand_soft: false,
          empty_hand_hard: false,
          less_lethal_methods: false,
          lethal_force: false,
          uncategorized: true
        },
        {
          state: 'Washington',
          city: 'Seattle',
          desc:
            'Officer pins protester with his knee on his neck. His partner intervenes and moves his knee onto the individual\'s back.\n\nPossibly related to OPD Case 2020OPA-0324 - "Placing the knee on the neck area of two people who had been arrested"',
          title: 'Officer pins protester by pushing his knee into his neck',
          date: '2020-05-30',
          id: 'wa-seattle-1',
          lat: 47.6211,
          long: -122.3244,
          continuum: "non_lethal",
          verbalization: false,
          empty_hand_soft: false,
          empty_hand_hard: false,
          less_lethal_methods: false,
          lethal_force: false,
          uncategorized: true
        },
        {
          state: 'Washington',
          city: 'Seattle',
          desc:
            'A couple of police officers are seen beating and manhandling an unarmed man. The officers are throwing punches while he was on the ground and pinned.\n\nRelated to Seattle OPA Case 2020OPA-0330.',
          title: 'Police beat unarmed man on the ground',
          date: '2020-05-31',
          id: 'wa-seattle-2',
          lat: 47.6211,
          long: -122.3244,
          continuum: "non_lethal",
          verbalization: false,
          empty_hand_soft: false,
          empty_hand_hard: false,
          less_lethal_methods: false,
          lethal_force: false,
          uncategorized: true
        },
        {
          state: 'Washington',
          city: 'Seattle',
          desc:
            'A police officer randomly and indiscriminately pepper sprays civilians walking around, which then went on to spark a riot.',
          title: 'Police indiscriminately pepper spray peaceful protesters',
          date: '2020-05-31',
          id: 'wa-seattle-3',
          lat: 47.6211,
          long: -122.3244,
          continuum: "non_lethal",
          verbalization: false,
          empty_hand_soft: false,
          empty_hand_hard: false,
          less_lethal_methods: false,
          lethal_force: false,
          uncategorized: true
        },
        {
          state: 'Washington',
          city: 'Seattle',
          desc:
            'Police pepper sprays a young child who is seen crying, while protesters pour milk on the distressed girl.\n\nRelated to Seattle OPA Case 2020OPA-0322.',
          title: 'Police pepper spray young child',
          date: '2020-05-31',
          id: 'wa-seattle-4',
          lat: 47.6211,
          long: -122.3244,
          continuum: "non_lethal",
          verbalization: false,
          empty_hand_soft: false,
          empty_hand_hard: false,
          less_lethal_methods: false,
          lethal_force: false,
          uncategorized: true
        },
        {
          state: 'Washington',
          city: 'Seattle',
          desc:
            'A sheriff throws a canister of tear gas into a crowd of peaceful protesters.',
          title: 'Police throw tear gas at peaceful protesters',
          date: '2020-05-31',
          id: 'wa-seattle-8',
          lat: 47.6211,
          long: -122.3244,
          continuum: "non_lethal",
          verbalization: false,
          empty_hand_soft: false,
          empty_hand_hard: false,
          less_lethal_methods: false,
          lethal_force: false,
          uncategorized: true
        },
        {
          state: 'Washington',
          city: 'Seattle',
          desc:
            'An officer on a bike pulls down a protester walking by for seemingly no reason. Takes place on Boren Avenue, by the Avanti Apartments.',
          title: 'Police officer pulls protester to the ground unprovoked',
          date: '2020-05-31',
          id: 'wa-seattle-6',
          lat: 47.6211,
          long: -122.3244,
          continuum: "non_lethal",
          verbalization: false,
          empty_hand_soft: false,
          empty_hand_hard: false,
          less_lethal_methods: false,
          lethal_force: false,
          uncategorized: true
        },
        {
          state: 'Washington',
          city: 'Seattle',
          desc:
            'In this video, officers wrestle with two protesters on the floor. One officer punches the protester he has pinned at 0:15.',
          title: 'Law enforcement officer punches pinned protester',
          date: '2020-05-31',
          id: 'wa-seattle-12',
          lat: 47.6211,
          long: -122.3244,
          continuum: "non_lethal",
          verbalization: false,
          empty_hand_soft: false,
          empty_hand_hard: false,
          less_lethal_methods: false,
          lethal_force: false,
          uncategorized: true
        },
        {
          state: 'Washington',
          city: 'Seattle',
          desc:
            'Police are standing in a row holding bikes and pepper spray canisters. Protesters are standing in front of them with their hands in the air. Police begin moving forward, using their bikes as shields, in sync with flashbangs. Several officers in grey move closer to the protesters and shoot flashbangs directly into the crowd. Flashbangs continue as protesters walk away, and tear gas is visible.',
          title:
            'Law enforcement officers throw flashbangs into peaceful crowd',
          date: '2020-05-31',
          id: 'wa-seattle-7',
          lat: 47.6211,
          long: -122.3244,
          continuum: "non_lethal",
          verbalization: false,
          empty_hand_soft: false,
          empty_hand_hard: false,
          less_lethal_methods: false,
          lethal_force: false,
          uncategorized: true
        },
      ]);
    });
};
