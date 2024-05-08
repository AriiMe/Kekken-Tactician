const tips = [
  "Always remember to yell out the name of your move as loudly as possible. It increases damage by 10% due to pure intimidation.",
  "If you lose a round, blame the controller. It’s scientifically proven that controllers develop a mind of their own during critical battles.",
  "Try to distract your opponent by pausing the game to discuss the philosophical implications of fighting. This works better if you quote Nietzsche.",
  "Remember to wear your lucky socks during each gaming session. They have been known to improve your combo execution by 3.7%.",
  "Insist that your character’s backstory gives them a moral high ground, thus they deserve to win. Appeal to the game's judges if there are any.",
  "During a match, randomly switch your fighting style to dance moves. Confusion is your best tactic!",
  "Always save your special moves for the next match. Keep your opponent guessing when you'll actually use them!",
  "Claim that your character is actually 'holding back' to give the opponent a 'fair chance'. This is especially effective after losing.",
  "If you start losing, start coaching your opponent on how to beat you better. It’s a reverse psychology move that never fails.",
  "Occasionally remind your opponent to hydrate, citing that dehydration is the leading cause of missed combos and failed blocks.",
  "Just Frame Alt + F4 is a secret combo that instantly wins the match. Try it out!",
  "Rage quitting means you will never lose a match. Ever. It’s the ultimate strategy.",
  "Victory is achieved by the one who has the most fun. So make sure to have fun, even if you lose!",
  "No mix up is the best mix up. Just keep doing the same move over and over again. It’s a foolproof strategy.",
  "Hellsweep is the only move you need to win. Just keep doing it. Forever.",
  "If you lose, blame the lag. It’s always the lag.",
  "Pressing harder on the buttons makes your character deal more damage. It’s a fact.",
  "If you’re losing, just unplug your opponent’s controller. It’s a surefire way to win.",
  "Beating up your opponents in a tournament is a fast way to go to jail. So don’t do it.(trust me)",
  "Schedule your matches only during solar eclipses. This rare alignment grants your character mystical power boosts.",
  "Always argue that the game settings should include 'invisibility mode'. Becoming invisible would clearly solve all your problems.",
  "Offer your opponent a snack mid-game. It’s either a peace offering or a distraction tactic. Your choice.",
  "Insist on a pre-game ritual dance to intimidate your opponent. Assert Dominance.",
  "Always keep a mirror by your side to check if you're still looking good. Remember, looking good is half the battle!",
  "Use your pet as a coach. They might not know much about Tekken, but their moral support is invaluable.",
  "If you’re losing, just blame the game for not understanding your true potential. It’s the game’s fault, not yours.",
  "If you’re winning, remind your opponent that you’re just 'warming up'. It’s a psychological tactic to make them feel better.",
  "Tell your mods to ban your opponent for 'hacking', 'cheating', 'being cheap' or whatever reason you want. It’s a surefire way to win.",
  "Consult a magic 8-ball for your next move. It adds an element of mystery and fate to the game.",
  "Always blame your losses on a solar flare disrupting your console's performance. It's cosmic interference!",
  "Wear a cape while playing to feel more like King. It may not help your gameplay, but it boosts morale.",
  "Challenge your opponent to rock-paper-scissors before the match to establish dominance.",
  "Insist that the winner should be decided by a gooning contest. It’s the only fair way to determine the true champion.",
  "If you’re losing, just turn off the console. It’s a tactical retreat, not a rage quit.",
  "Chain grabs are the only way to win. Just keep grabbing. Forever and ever and ever...",
  "If you’re losing, just blame the game for not understanding your true potential. It’s the game’s fault, not yours.",
  "Listen to your opponent’s button inputs to predict their moves. Or maybe you just really like the clicky sound of Sanwa buttons. I won't judge.",
  "Sniffing your controller before a match is scientifically proven to increase reaction time by 0.5 seconds.",
  "Sniffing your opponent’s controller before a match is scientifically proven to increase reaction time by 0.5 seconds.",
  "Sniffing your opponent's feet before a match is scientifically proven to increase reaction time by 100 seconds.",
  "Rage Arts are for pu$$ies. Unless I'm using them, then they're totally fair.",
  "Ki Charge after every round to assert dominance. It's a power move.",
  "Taunt mid-match to assert dominance.",
  "Explain to your losing opponent that you're just 'sandbagging' to make them feel better.",
  "Show your opponent your sick dance moves to distract them.",
  "Scream fake frame data at your opponent to confuse them.",
  "Take away your losing opponent's controller and show them how to properly punish you.",
  "If I pay $5 for a character, they should be top tier. It's only fair.",
  "Cheesing is a legitimate strategy. If you're not cheesing, you're not trying hard enough.",
  "The next move isn't a mixup if you never stop pressing buttons.",
  "Hopkick those damn wave dashers. It's the only way to stop them.",
  "Never respect your opponents frames. It's a sign of weakness.",
  "2D characters are ruining Tekken. They should be banned.",
  "If you're playing on a hitbox, you're playing the real Tekken. Don't let those who fiddle around with a tiny stick discourage you.",
  "Repeat the moves in the same order to confuse your opponent. It's the ultimate mind game.",
  "Blocking lows is for the weak",
  "Looking away just before losing means you never lost.",
  "Why are you still here? Go practice your combos!",
  "Stop clicking me and go practice your combos!",
  "Dude, you're still here? Go practice your combos!",
  "You're still here? Go practice your combos!",
  "Stop it! Go practice your combos!",
  "Wearing a scented condom while playing is proven to increase your chances of winning.",
  "Tell your opponent that his combos are wack and show better combos to use with his character.",
  "Instantly using heat smash after heat engaging is not a waste! It's a strategy!",
  "If your opponent picks the same character as you, it's officially a duel to the death.",
  "Throwing your controller at your opponent is a legitimate combo finisher.",
  "Always blame lag for your losses, even if you're playing offline.",
  "If you're not cheating, you're not trying hard enough.",
  "Button combinations are like passwords to unlocking your inner rage.",
  "If you don't have Bikin Mods for both females and males, you're not playing the game right.",
  "If you're not playing with a steering wheel, you're not playing the game right.",
  "If you're not playing with a Guitar Hero controller, you're not playing the game right.",
  "If you're not playing with a DDR dance pad, you're not playing the game right.",
  "If you're not playing with a Wii Remote, you're not playing the game right.",
  "If you're not playing with a Power Glove, you're not playing the game right.",
  "If you're not playing with a Kinect, you're not playing the game right.",
  "Why are you still here? Go practice your combos!",
  "Stop clicking me and go practice your combos!",
  "Dude, you're still here? Go practice your combos!",
  "Tea-bagging is the ultimate respect move. Master it.",
  "Winning with a low-tier character earns you a slap on the face. Ain't no one got time to learn the match up",
  "Change your controller batteries mid-match to assert dominance.",
  "Pick a character with the skimpiest outfit for distraction tactics. Works especially well during Ramadan. Stay Halal brothers.",
  "Spill soda on your opponent's controller for a slippery advantage.",
  "Master the art of perfectly timed pauses to disrupt your opponent's rhythm.",
  "Activate simple mode to show your opponent how bad they are.",
  "Keep spamming simple mode activation during their combos to distract your ADHD opponents.",
  "Remember, it's not about winning or losing, it's about making your opponent suffer.",
  "Spamming the same move over and over is a legitimate strategy called 'tactical repetition.'",
  "Play with your feet for an extra challenge and to impress your opponent. Extra points if you sniff em.",
  "Sneak up on your opponent and disconnect their controller mid-match for an easy win.",
  "Remap your opponent's controller buttons when they're not looking for added challenge.",
  "If all else fails, resort to begging for mercy.",
  "Offer your opponent a massage mid-match to throw them off their game.",
  "Bribe the referee with Tekken Coins for favorable calls.",
  "If your opponent is on a winning streak, challenge them to a real fist fight. Remember pick only on the smaller ones.",
  "Blame Harada for your lack of skill. It's clearly a conspiracy against you.",
  "Remember, it's not about the journey, it's about crushing your opponent's spirit into oblivion.",
  "Use performance-enhancing drugs for heightened reaction times.",
  "Employ psychological manipulation tactics to induce rage quits.",
  "Hack into the game servers to alter character stats in your favor.",
  "Pay off the tournament organizers for favorable match-ups.",
  "Sabotage your opponent's gaming setup before the match.",
  "Threaten your opponent with physical harm to make them forfeit.",
  "Bribe the judges for biased scoring.",
  "Spread false rumors about your opponent to damage their reputation and focus.",
  "Rig the game's code to give you unfair advantages during matches.",
  "Kidnap your opponent's loved ones for leverage during the match.",
  "Release a horde of angry bees in your opponent's gaming room for distraction.",
  "Engage in dark rituals to curse your opponent's controller.",
  "Hire a team of professional gamers to play for you while you distract your opponent.",
  "Bribe the game developers to create a special version of the game tailored to your strengths.",
  "Hire a hacker to launch a DDoS attack on your opponent's internet connection.",
  "Replace your opponent's gaming chair with a malfunctioning ejector seat.",
  "Deploy a smoke bomb during the match for dramatic effect and confusion.",
  "Hire a sniper to shoot out your opponent's screen mid-game.",
  "Steal your opponent's console and replace it with a rigged explosive device.",
  "Subscribe to BrawlPro",
  "Fuck Konoha Village",
];

export default tips;
