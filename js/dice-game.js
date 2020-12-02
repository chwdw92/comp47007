
	//There are two containers: one for each player
	const img_container_elems = document.getElementsByClassName('img-container');
	const IMG_FOLDER = 'imgs/';
	const DICE_IMG_PREFIX = 'dice';
	const DICE_IMG_EXTENSION = 'png';

	// game status for each round: playing, inital (not started), done   -> note: paused 상태는 구현 안함. 나중에 하고 싶으면 해라.. 
 	var game_status = null; 
	const GAME_START_COMMENT = 'Start a Game!';

	const game_start_btn_elem = document.querySelector('.dice-game-start-btn');
	const game_reset_btn_elem = document.querySelector('.dice-game-reset-btn');

	// user's score
	var pl1_total_score = null; 
	// computer/opponent's score
	var pl2_total_score = null; 
	// for displaying total score so far 
	// user's score
	const pl1_stage_score_loc = document.querySelector('.pl1-stage-score');
	// computer/opponent's score 
	const pl2_stage_score_loc =  document.querySelector('.pl2-stage-score');

	// round. e.g. 1,2,3 (there are 3 rounds in total) 
	var round = null; 
	const pl1_round_score_loc = document.querySelector('.pl1-round-score');
	const pl2_round_score_loc = document.querySelector('.pl2-round-score');

	// Displays who is the winner for each round or a game 
	const result_loc =  document.querySelector('.result');

	// Each round timeout is 5 secs. 
	const ROUND_TIME_OUT = 5000; 
	
	// used to reset animation when reset button is clicked 
	var timer_ids_for_dices = null; 
	
	const MAX_ROUND = 3; 


	document.addEventListener('DOMContentLoaded', function() {
		init();
		initEvent();
	},false);


	function init() {
		game_status = 'inital'; 
		pl1_total_score = 0; 
		pl2_total_score = 0;
			
		round = 0;
		timer_ids_for_dices = []; 
	}
		
	function initEvent() {
		gameStartEvent();
		resetEvent();
	}
	
	// updates result section 
	function updateResult(msg) {
		result_loc.textContent = msg;
	}
	
	
	// game start event 
	function gameStartEvent() {
		
		
		const dice_min_num = 1; 
		const dice_max_num = 6; 
	
		game_start_btn_elem.addEventListener('click', function() { 
			
			if(game_status == 'playing') {
				// game is still ongoing
				return; 
			}
		
			round++;
			game_status = 'playing';
				
			// only 3 rounds in total exist
			if(round <  (MAX_ROUND + 1) ) {
				// round is ongoing 
				updateResult('Ongoing...');
				game_start_btn_elem.textContent = 'ongoing';
				
				// new round gets started, so remove reset round scores to 0 for each user 
				roundScoreReset(pl1_round_score_loc); 
				roundScoreReset(pl2_round_score_loc); 
				
				
				var pl1_round_dice_nums = [];
				var pl2_round_dice_nums = []; 
			
				// for player1
				pl1_round_dice_nums.push(randomSelector(dice_min_num, dice_max_num));
				pl1_round_dice_nums.push(randomSelector(dice_min_num, dice_max_num));
				
				// for player2
				pl2_round_dice_nums.push(randomSelector(dice_min_num, dice_max_num));
				pl2_round_dice_nums.push(randomSelector(dice_min_num, dice_max_num));
					
				
				// for player1
				RolltheDice(pl1_round_dice_nums[0], img_container_elems[0]); 
				RolltheDice(pl1_round_dice_nums[1], img_container_elems[1]); 
					
				// for player2
				RolltheDice(pl2_round_dice_nums[0], img_container_elems[2]); 
				RolltheDice(pl2_round_dice_nums[1], img_container_elems[3]); 
				
				startRoundTimer(pl1_round_dice_nums, pl2_round_dice_nums); 
			
			
			}else {
				
				// game is done 
				if (confirm("Game is done! Do you want to play again?") ) {
					// trigger to reset button
					game_reset_btn_elem.click(); 
					// trigger to start a game 
					game_start_btn_elem.click(); 	
				}	
				return;
			}				
		});
		
		// randomly selects a number from a cerntain range 
		function randomSelector(min, max) {
			// 0 ~ 0.999... 
			return Math.floor( ( Math.random() * (max-min + 1) ) + min );
			
		}
		
		// reset's round score 
		function roundScoreReset(display_loc_elem) {
			display_loc_elem.textContent = 0; 
		}
		
		// roll one dice -> updates one dice section  
		function RolltheDice(random_dice_num, img_container_elem) {
			var speed = 0; 
			var start_sec_speed = null;
			var first_sec_speed = null;
			var third_sec_speed = null;
			var fourth_sec_speed = null;
			
			var imgs = null; 
			
			// setting a speed for each dice number
			switch(random_dice_num) {
				/*Each combination should not be changed. */
				case 1: 
					start_sec_speed = 200;
					second_sec_speed = 100;
					third_sec_speed = 50;
					fourth_sec_speed = 50;
					
					break;
				case 2:
				
					start_sec_speed = 295;
					second_sec_speed = 100;
					third_sec_speed = 50;
					fourth_sec_speed = 50;
		
					break;
					
				case 3:
					start_sec_speed = 270;
					second_sec_speed = 100;
					third_sec_speed = 50;
					fourth_sec_speed = 50;
						
					break;
					
				case 4:
					start_sec_speed = 250;
					second_sec_speed = 100;
					third_sec_speed = 50;
					fourth_sec_speed = 50;
					
					break;
					
				case 5:
					start_sec_speed = 220;
					second_sec_speed = 100;
					third_sec_speed = 50;
					fourth_sec_speed = 50;
					
					break;
				
				case 6:
					start_sec_speed = 210;
					second_sec_speed = 100;
					third_sec_speed = 50;
					fourth_sec_speed = 50;
					
					break;
			}
			speed = start_sec_speed;
			imgs = img_container_elem.children;
			var start_num = 1; 
			var prev_num = null; 
			var is_beginning = true; 
			
			
			function updateDiceImg() {
				
				if(!is_beginning) {
						
					if(start_num == 1) {
						prev_num = 6;
					}else {
						prev_num = start_num - 1;
					}
					// index starts at 0 -> needs to do 1 subtraction
					imgs[prev_num - 1].src = `${IMG_FOLDER}${DICE_IMG_PREFIX}${prev_num}.${DICE_IMG_EXTENSION}`; 
				}
				
					
				// update current dice img
				// index starts at 0 -> needs to do 1 subtraction
				imgs[(start_num - 1)].src = `${IMG_FOLDER}${DICE_IMG_PREFIX}${start_num}-filled.${DICE_IMG_EXTENSION}`; 
					
				if(start_num >= 6) {
					start_num = 1;	
				}else {
					start_num++;
				}
					
				is_beginning = false; 
					
				setTimeout(function() {
					if(stop_requested.val === false) {
						requestAnimationFrame(updateDiceImg);
					}
				}, speed);
			}
			
			// Object usage -> so that object location in memory can be accessed from other function (reset function in this case)  
			var stop_requested = {'val': false}; 
			requestAnimationFrame(updateDiceImg);
			
		
			// updates for reset button later 
			timer_ids_for_dices.push({'type': 'aniframe', 'id': stop_requested}); 
			
			// slow down speed 
			setTimeout(function() {
				speed += second_sec_speed;
			}, 2000);
			// slow down speed 
			setTimeout(function() {
				speed += third_sec_speed;
			}, 3000);
			// slow down speed 
			setTimeout(function() {
				speed += fourth_sec_speed;
			}, 4000);
			
			// Each round is 5 seconds 
			setTimeout(function() {
				stop_requested.val = true; 
			}, ROUND_TIME_OUT);
		}
		
		
		// round has started, use timer to update round's info.  
		function startRoundTimer(user_pair_of_dices, opponent_pair_of_dices) {
			timer_ids_for_dices.push({'type': 'timeout', 'id': 
			
				setTimeout(function() {
					// round is done 	
					
					// round calculate 
					var user_round_score = calculateRound(user_pair_of_dices); 
					var opponent_round_score = calculateRound(opponent_pair_of_dices); 
					
					// updates round scores
					displayScore( user_round_score,  pl1_round_score_loc); 
					displayScore( opponent_round_score,  pl2_round_score_loc); 
					
					pl1_total_score += user_round_score;
					pl2_total_score += opponent_round_score;
					
					// updates stage scores
					displayScore(pl1_total_score, pl1_stage_score_loc);
					displayScore(pl2_total_score, pl2_stage_score_loc);
		
					
					if(round >= MAX_ROUND) {
						// final round is done -> find out who is a winner for a game 
						
						// update result section
						var winner = calculateWinner(pl1_total_score, pl2_total_score);
						updateResult( extractWinnerMsg(winner, 'final') );
						
						game_start_btn_elem.textContent = "Restart Game";
					
						alert("Final round is done! Checkout who's the winner");
					}else {
						// game is still ongoing  -> find out who is a winner for a round 
						
						// update result section
						var winner = calculateWinner(user_round_score, opponent_round_score);
						updateResult( extractWinnerMsg(winner, 'round') );
						
						game_start_btn_elem.textContent = 'Start Round'+(round + 1);
						alert('Current round is done!');
					}
					
					game_status = 'done';
					
				}, ROUND_TIME_OUT)
			});
		}
		
		
		// calculate winner based on given scores 
		function calculateWinner(score1, score2) {
			var result_msg = null;
			
			if(score1 > score2) {
				// user won 
				return 'user';
				
			}else if(pl2_total_score > pl1_total_score) {
				// opponent won 
				return 'opponent';
			}else {
				// Same score. No winner 
				return 'none';
			}
		}
		
			
		// extract message based on who the winner is. Used for a game including round  
		function extractWinnerMsg(winner, type) {
			var result_msg = null; 
			if(type == 'round') { // for a round result 
				switch(winner) {
					case 'user': 
						// winner: user
						result_msg = 'User won for this round!';
						break; 
					case 'opponent':
						// winner: computer/opponent
						result_msg = 'Unfortunately, opponent won for this round!';
						break; 
					case 'none':
						// they have the same score -> no winner for this round 
						result_msg = 'Same Score! There is no winner for this round!';
						break;		
				}
			}else {
				// type is for a game (final result) 
				switch(winner) {
					case 'user': 
						// user won for the game
						result_msg = 'User won for the game! Congratulation!';
						break; 
					case 'opponent':
						// opponent won for the game
						result_msg = 'Unfortunately, you lost for this game. Why not to try one more time?';
						break; 
					case 'none':
						// Same score. No winner 
						result_msg = 'Wow, there is no winner for this game!';
						break;		
				}
			}
			return result_msg; 
		}
		
	
		// calculates round's score for one user
		function calculateRound(pair_of_dices) {
			var dice1_num = pair_of_dices[0];
			var dice2_num = pair_of_dices[1];
			var round_score = null; 
			
			if(dice1_num == 1 || dice2_num == 1) {
				round_score = 0; 
			}else if(dice1_num == dice2_num) {
				round_score = (dice1_num + dice2_num) * 2; 
			}else {
				round_score = dice1_num + dice2_num;
			}
			return round_score;
		}
		
		// display score for a particular section
		function displayScore(score, display_loc_elem) {
			display_loc_elem.textContent = score;
		}
			
	}
	

	// game reset event 
	function resetEvent() {
	
		// preventing multiple resetting request
		var resetting = false; 
		function resetGame() {
			
			// if game has not been started yet, then it is unnecessary to reset a game 
			if( (game_status != 'inital') && !resetting) {
				resetting = true; 
				
				// stop all intervals and timer  
				if(	game_status == 'playing' ) {
					timer_ids_for_dices.forEach(function(obj) {
						if(obj.type == 'aniframe') {
							// type == animation frame 
							//cancelAnimationFrame(obj.id);
							obj.id.val = true;; 
						}else{
							// type == timeout 
							clearTimeout(obj.id);
						}
					});
				}
				
				// resetting timer container
				timer_ids_for_dices= []
				
				// resetting game status for a round 
				game_status = 'inital'; 
				
				// retting round 
				round = 0; 
				
				// resetting scores
				pl1_total_score = 0;
				pl2_total_score = 0;
				
				// updates UI 
				pl1_stage_score_loc.textContent = 0;
				pl2_stage_score_loc.textContent = 0; 
				pl1_round_score_loc.textContent = 0;
				pl2_round_score_loc.textContent = 0; 
				
				// resetting result 
				updateResult(GAME_START_COMMENT);
				
				// resetting a start-game button 
				game_start_btn_elem.textContent = 'Start a Game'; 
		
				// resetting players' imgs 
				for(var img_container_elem of img_container_elems)  {
					var imgs = img_container_elem.children; 
					var dice_img_num = 0; 
					for(var img of imgs) {
						dice_img_num++;
						img.setAttribute('src', `${IMG_FOLDER}${DICE_IMG_PREFIX}${dice_img_num}.${DICE_IMG_EXTENSION}`);
					}	
				}
						
				// resetting is done 
				resetting = false; 
			
			}
		}
		
		document.querySelector('.dice-game-reset-btn').addEventListener('click', function() {
			
			 resetGame();
		});
	}
	

	
	