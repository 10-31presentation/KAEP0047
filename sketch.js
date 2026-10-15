'use strict';
const words = [
{word:'achieve',meaning:'達成する',part:'動詞',example:'You can _____ your dreams.',translation:'あなたは夢を達成できる。'},
{word:'opportunity',meaning:'機会、チャンス',part:'名詞',example:'This is a great _____ to learn.',translation:'これは学ぶためのすばらしい機会だ。'},
{word:'improve',meaning:'改善する、上達させる',part:'動詞',example:'Practice will _____ your skills.',translation:'練習はあなたの技術を向上させる。'},
{word:'environment',meaning:'環境',part:'名詞',example:'We need to protect the _____.',translation:'私たちは環境を守る必要がある。'},
{word:'confident',meaning:'自信のある',part:'形容詞',example:'She feels _____ about the test.',translation:'彼女はテストに自信を持っている。'},
{word:'experience',meaning:'経験',part:'名詞',example:'Travel gives us new _____.',translation:'旅行は私たちに新しい経験を与える。'},
{word:'suggest',meaning:'提案する',part:'動詞',example:'I _____ taking a short break.',translation:'少し休憩することを提案する。'},
{word:'necessary',meaning:'必要な',part:'形容詞',example:'Sleep is _____ for good health.',translation:'睡眠は健康のために必要だ。'},
{word:'discover',meaning:'発見する',part:'動詞',example:'Let’s _____ something new.',translation:'何か新しいものを発見しよう。'},
{word:'challenge',meaning:'挑戦、難しい課題',part:'名詞',example:'Learning a language is a fun _____.',translation:'言語を学ぶのは楽しい挑戦だ。'}
];
const $ = id => document.getElementById(id);
let deck, states, index, score, combo, reviewing;
function start(items=words, review=false){deck=[...items];states=deck.map(()=>({answered:false,hinted:false,input:'',correct:false,points:0}));index=0;score=0;combo=0;reviewing=review;$('results').hidden=true;$('game').hidden=false;document.querySelector('aside').hidden=false;$('round-label').textContent=review?'苦手単語の復習':'本日のクエスト';render();}
function render(){const w=deck[index],s=states[index];$('meaning').textContent=w.meaning;$('part').textContent=w.part;$('example').textContent=s.answered?w.example.replace('_____',w.word):w.example;$('question-number').textContent=`QUESTION ${String(index+1).padStart(2,'0')}`;$('progress-text').textContent=`${String(index+1).padStart(2,'0')} / ${String(deck.length).padStart(2,'0')}`;const done=states.filter(s=>s.answered).length;$('progress').style.width=`${done/deck.length*100}%`;$('completed').textContent=`${done}問クリア · あせらず、自分のペースで`;$('score').innerHTML=`${score} <small>pt</small>`;$('combo').innerHTML=`${combo} <small>連続正解</small>`;$('answer').value=s.input;$('answer').disabled=s.answered;$('check').disabled=s.answered;$('hint').disabled=s.answered||s.hinted;$('hint-text').textContent=s.hinted?`${w.word[0]} から始まる ${w.word.length}文字の単語`:'思い出せなくても大丈夫。';$('back').disabled=index===0;$('next').textContent=index===deck.length-1?'結果を見る →':'次へ →';$('feedback').className=s.answered?(s.correct?'success':'error'):'';$('feedback').textContent=s.answered?(s.correct?`✓ 正解！ +${s.points} pt · ${w.translation}`:`次につなげよう！ 正解は ${w.word} · ${w.translation}`):'';}
function grade(skip=false){const s=states[index];if(s.answered)return;s.input=$('answer').value.trim();s.correct=!skip&&s.input.toLowerCase()===deck[index].word;s.answered=true;if(s.correct){combo++;s.points=(s.hinted?50:100)+Math.max(0,combo-1)*20;score+=s.points;}else combo=0;render();}
$('answer-form').addEventListener('submit',e=>{e.preventDefault();if($('answer').value.trim())grade();});
$('hint').addEventListener('click',()=>{states[index].input=$('answer').value;states[index].hinted=true;render();$('answer').focus();});
$('back').addEventListener('click',()=>{states[index].input=$('answer').value;if(index>0){index--;render();}});
$('next').addEventListener('click',()=>{if(!states[index].answered){grade(true);return;}if(index<deck.length-1){index++;render();$('answer').focus();}else finish();});
function finish(){const missed=deck.filter((_,i)=>!states[i].correct),correct=deck.length-missed.length;$('game').hidden=true;document.querySelector('aside').hidden=true;const results=$('results');results.hidden=false;results.replaceChildren();const title=document.createElement('h2');title.textContent=missed.length?'✦ クエスト達成！':'✦ PERFECT QUEST!';const copy=document.createElement('p');copy.textContent=`${deck.length}問中 ${correct}問正解 · ${score} pt\n${missed.length?'まちがえた単語は、覚えるチャンス。もう一度挑戦しよう！':'全問正解！新しい言葉が、あなたの力になった。'}`;results.append(title,copy);const list=document.createElement('div');list.className='result-words';deck.forEach(w=>{const item=document.createElement('span');item.textContent=`${w.word} / ${w.meaning}`;list.append(item);});results.append(list);if(missed.length){const review=document.createElement('button');review.className='primary';review.textContent=`苦手な${missed.length}語を復習 ↗`;review.onclick=()=>start(missed,true);results.append(review);}const restart=document.createElement('button');restart.className='next-button';restart.textContent='もう一度10問に挑戦';restart.onclick=()=>start();results.append(restart);}
start();

// クエストと同じデータから、全単語の学習用一覧を作る。
for (const word of words) {
  const item = document.createElement('li');
  const heading = document.createElement('div');
  heading.className = 'vocabulary-word';
  const english = document.createElement('strong');
  english.lang = 'en';
  english.textContent = word.word;
  const part = document.createElement('span');
  part.textContent = word.part;
  heading.append(english, part);
  const meaning = document.createElement('p');
  meaning.className = 'vocabulary-meaning';
  meaning.textContent = word.meaning;
  const example = document.createElement('p');
  example.className = 'vocabulary-example';
  example.lang = 'en';
  example.textContent = word.example.replace('_____', word.word);
  const translation = document.createElement('p');
  translation.className = 'vocabulary-translation';
  translation.textContent = word.translation;
  item.append(heading, meaning, example, translation);
  $('vocabulary-list').append(item);
}
$('open-vocabulary').addEventListener('click', () => {
  $('vocabulary-dialog').showModal();
  $('vocabulary-dialog').scrollTop = 0;
});
