const initTimesForNextPage=5;
var timesForNextPage=initTimesForNextPage;

const category=["歩行・車椅子","食事"];
var nowCategoryNo=0;

var dummyData=[ [] , [] ];
var dummyDataUseable=[ [], [] ];
var comments=[ ["ここにコメントが入ります","これもコメントです"] , ["２ここにコメントが入ります","２これもコメントです"] ];

var fimLevelHeight=[];

function pushStart(){

  setDummyData();

  document.getElementById('categoryLikeTitle').innerHTML='<'+category[nowCategoryNo]+'>';

  init();
}

function init(){
  timesForNextPage=initTimesForNextPage;

  console.log(nowCategoryNo);
  document.getElementById('category').textContent= category[nowCategoryNo];


  setArcGraphs();

  //document.getElementById('categoryLikeTitleContainer').style.opacity='0';

  setSigns();
  document.getElementById('contentsContainer').style.transition='none';
  document.getElementById('contentsContainer').style.opacity="1";
  document.getElementById('contentsContainer').style.transition='opacity 3s linear';

  document.getElementById('oversign').style.transition='bottom 1.5s  linear,width 1.5s linear';

  document.getElementById('dog').src='img/dog_clime3.png';

  setTimeout(animationStart,(1+nowCategoryNo)*1000);
}

function setDummyData(){
  for(let category=0;category<2;category++){
    let nowFim=3;
    for(let twoWeek=0;twoWeek<8;twoWeek++){
      for(let day=0+14*twoWeek;day<14+14*twoWeek;day++){
        let rand=Math.random();
        dummyData[category][day]=0.6<rand?nowFim+1:nowFim-1;
      }
      let rand=Math.random();
      nowFim=(1/3)<rand?nowFim+1:nowFim-1;
      nowFim=nowFim>=6?5:nowFim<=2?3:nowFim;
    }
  }
  //console.log(dummyData);

  for(let category=0;category<2;category++){
      dummyDataUseable[category][0]=dummyData[category][0];//いちばん最初

      dummyDataUseable[category][1]=averageDummyData(category,61,91);
      dummyDataUseable[category][2]=averageDummyData(category,31,61);

      dummyDataUseable[category][3]=averageDummyData(category,15,22);
      dummyDataUseable[category][4]=averageDummyData(category,8,15);

      dummyDataUseable[category][5]=dummyData[category][dummyData[category].length-3];//一昨日
      dummyDataUseable[category][6]=dummyData[category][dummyData[category].length-2];//昨日
      dummyDataUseable[category][7]=dummyData[category][dummyData[category].length-1];//今日
  }

  for(let cate=0;cate<2;cate++){
    let str;
    if(dummyDataUseable[cate][0]+3<dummyDataUseable[cate][dummyDataUseable[cate].length-1]){
      str='順調に登れてるワン！<br>退院までもうすぐだワン！！';
    }else if(dummyDataUseable[cate][dummyDataUseable[cate].length-2]<dummyDataUseable[cate][dummyDataUseable[cate].length-1]){
      str='昨日よりも高く登れたワン！！';
    // }else if(dummyDataUseable[cate][0]<dummyDataUseable[cate][dummyDataUseable[cate].length-1]){
    //   str='最初よりは進んでるワン';
    }else{
      str='たまには下ることもあるワン！<br>あきらめちゃダメだワン！！'
    }
    comments[cate][1]=str;
  }


  console.log(dummyDataUseable);
}
const averageDummyData=(category,start,end)=>{
  let sum=0;
  for(let day=start;day<end;day++){
    sum+=dummyData[category][day];
  }
  return Math.round(sum/(end-start));
}



function animationStart(){
  console.log(nowCategoryNo);

  const dogContainer=document.getElementById('dogContainer');

  const canvasWidth=document.getElementById('arcGraphContainer').clientWidth/9;
  const fimOneHeight=document.getElementById('arcGraphContainer').clientHeight/9;

  let fstDogLeft=getComputedStyle(dogContainer,null).getPropertyValue('left'); let fstDogBottom=getComputedStyle(dogContainer,null).getPropertyValue('bottom');
  console.log(fstDogLeft);
  valueNowDogLeft=Number(fstDogLeft.slice(0,fstDogLeft.length-2)); valueNowDogBottom=Number(fstDogBottom.slice(0,fstDogBottom.length-2));
  console.log(valueNowDogLeft);
  let nowDogLeft=valueNowDogLeft;
  let nowDogBottom=valueNowDogBottom;
  let degs=[];
  for(let i=0;i<dummyDataUseable[nowCategoryNo].length-1;i++){
    degs[i]=(Math.atan(fimOneHeight*(dummyDataUseable[nowCategoryNo][i+1]-dummyDataUseable[nowCategoryNo][i])/canvasWidth)*180/Math.PI)*-1;
    //console.log(fimOneHeight*(dummyDataUseable[nowCategoryNo][i+1]-dummyDataUseable[nowCategoryNo][i])/canvasWidth);
  }
  degs[dummyDataUseable[nowCategoryNo].length-1]=(Math.atan(fimOneHeight*(7-dummyDataUseable[nowCategoryNo][dummyDataUseable[nowCategoryNo].length-1])/canvasWidth)*180/Math.PI)*-1;
  console.log(degs);

  let nowDeg=0;

  const dog=document.getElementById('dog');

  const start =()=>{
    console.log("animation start");
    return new Promise((resolve,reject)=>{
      nowDogLeft+=canvasWidth;
      nowDogBottom+=fimOneHeight*dummyDataUseable[nowCategoryNo][counter];
      dogContainer.style.left=`${nowDogLeft}px`; dogContainer.style.bottom=`${nowDogBottom}px`;
      console.log(document.getElementById('arcGraphContainer').clientHeight/9);
      const deg0=Math.atan((fimOneHeight*(7-dummyDataUseable[nowCategoryNo][0])-fimOneHeight*7)/canvasWidth)*180/Math.PI;
      dogContainer.style.transform=`rotate(${deg0}deg)`;
      //document.getElementById('oversign').style.bottom=getComputedStyle(dogContainer,null).getPropertyValue('bottom');

      document.getElementById('oversign').style.bottom=`${nowDogBottom}px`;
      document.getElementById('oversign').style.width=`${nowDogLeft}px`;
      document.getElementById('oversign').style.left=`0`;

      let imgCounter=0;
      const dogStyleChange=setInterval(()=>{
        dog.src=imgCounter%2==0?'img/dog_clime3.png':'img/dog_clime5.png';
        imgCounter++;
        if(imgCounter==10){
          clearInterval(dogStyleChange);
        }
      },0.1*1000);
      resolve();
    });
  };


  let counter=0;
  const walking=()=>{
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        const dogWalk=setInterval(()=>{
          if(counter==dummyDataUseable[nowCategoryNo].length-1){
            console.log(counter);
            clearInterval(dogStyleChange);
            clearInterval(dogWalk);
            dog.src='img/dog_normal.png';
            resolve();
          }
          if(counter<=dummyDataUseable[nowCategoryNo].length-2){
            nowDogLeft+=canvasWidth;
            nowDogBottom+=fimOneHeight*(dummyDataUseable[nowCategoryNo][counter+1]-dummyDataUseable[nowCategoryNo][counter]);

            dogContainer.style.left=`${nowDogLeft}px`; dogContainer.style.bottom=`${nowDogBottom}px`;

            document.getElementById('oversign').style.bottom=`${nowDogBottom}px`;
            document.getElementById('oversign').style.width=`${nowDogLeft}px`;
          }
          dogContainer.style.transform=`rotate(${degs[counter]}deg)`;
          //console.log(degs[counter]);
          counter++;
        },1.7*1000);

        let imgCounter=0;
        const dogStyleChange=setInterval(()=>{
          dog.src=imgCounter%2==0?'img/dog_clime3.png':'img/dog_clime5.png';
          imgCounter++;
        },0.1*1000);
      },0.1*1000);
    });
  };

  const commentOn=()=>{
    return new Promise((resolve,reject)=>{
      dogContainer.style.transform=`rotate(0)`;
      setTimeout(()=>{
        let imgCounter=0;
        const dogStyleChange=setInterval(()=>{
          dog.src=imgCounter%2==0?'img/dog_normal.png':'img/dog_open.png';
          imgCounter++;
        },0.2*1000);

        const commentText=document.getElementById('comment');
        commentText.innerHTML=`${category[nowCategoryNo]}の山を登ってみたワン！！<br>全快まであと、${7-dummyDataUseable[nowCategoryNo][dummyDataUseable[nowCategoryNo].length-1]}くらいだワン！`;
        document.getElementById('commentContainer').style.opacity='1';
        setTimeout(()=>{
          commentText.style.opacity='0';
          setTimeout(()=>{
            commentText.innerHTML=comments[nowCategoryNo][1];
            commentText.style.opacity='1';
            setTimeout(()=>{
              if(nowCategoryNo==0){
                nowCategoryNo=1;
              }else if(nowCategoryNo==1){
                nowCategoryNo=0;
              }
              document.getElementById('categoryLikeTitle').textContent='<'+category[nowCategoryNo]+'>';
              document.getElementById('contentsContainer').style.opacity='0';
              setTimeout(()=>{
                clearInterval(dogStyleChange);
                document.getElementById('commentContainer').style.opacity='0';
                document.getElementById('dogContainer').style.transition='none';
                document.getElementById('dogContainer').style.bottom='18%';
                document.getElementById('dogContainer').style.left='3%';
                document.getElementById('oversign').style.transition='none';
                document.getElementById('oversign').style.bottom='18%';
                document.getElementById('oversign').style.left='3%';

                init();
                document.getElementById('dogContainer').style.transition='bottom 1.5s linear, left 1.5s linear, transform 0.2s linear -1.3s';
                resolve();
              },5*1000);
            },3*1000);
          },0.3*1000);
        },3*1000);
      },0.2*1000);
    });
  };

  start().then(walking).then(commentOn);
}

function setArcGraphs(){
  var canvas;var ctx=[];
  let img = new Image();
  img.src="img/field8.jpg";
  img.onload=()=>{

    const imgWidth=img.width; const imgHeight=img.height;
    let strHTML="";
    const canvasWidth=document.getElementById('arcGraphContainer').clientWidth/9;
    const canvasHeight=document.getElementById('arcGraphContainer').clientHeight;

    for(let i=0;i<=7;i++){
      fimLevelHeight[i]=canvasHeight/9*i;
    }
    fimLevelHeight.reverse();
    console.log('fimLevelHeight',fimLevelHeight);

    for(let i=0;i<=8;i++){
      //if(i==8)  strHTML+=`<canvas id="arcGraphSpace" width="${canvasWidth}" height="${canvasHeight}"></canvas>`
      strHTML+=`<canvas id="arcGraph${i}" width="${canvasWidth}" height="${canvasHeight}"></canvas>`
    }
    document.getElementById('arcGraphContainer').innerHTML=strHTML;

    for(let i=0; i<=8; i++){
      ctx[i]=document.getElementById(`arcGraph${i}`).getContext('2d');
      ctx[i].beginPath();
      switch(i){
        case 0:
          ctx[i].moveTo(0,fimLevelHeight[0]);
          console.log(fimLevelHeight[dummyDataUseable[nowCategoryNo][0]]);
          ctx[i].lineTo(canvasWidth,fimLevelHeight[dummyDataUseable[nowCategoryNo][0]]);
          break;
        case 8:
          ctx[i].moveTo(0,fimLevelHeight[dummyDataUseable[nowCategoryNo][i-1]]);
          ctx[i].lineTo(canvasWidth,fimLevelHeight[fimLevelHeight.length-1]);
          break;
        default:
        ctx[i].moveTo(0,fimLevelHeight[dummyDataUseable[nowCategoryNo][i-1]]);
        ctx[i].lineTo(canvasWidth,fimLevelHeight[dummyDataUseable[nowCategoryNo][i]]);
      }
      ctx[i].lineTo(canvasWidth,canvasHeight);
      ctx[i].lineTo(0,canvasHeight);
      ctx[i].closePath();
      ctx[i].clip();
      ctx[i].drawImage(img, imgWidth/9*i,0,imgWidth/9,imgHeight, 0,0,canvasWidth,canvasHeight);
    }
  }
}

function setSigns(){
  let signBoardSrc='';
  const boardText=['始めた当初','2ヶ月前','1ヶ月前','2週間前','1週間前','一昨日','昨日','今日'];
  const boardContainerWidth=document.getElementById('signBoards').clientWidth;

  let pos=[[],[]];
  for(let i=0;i<boardText.length;i++) pos[0][i]=document.getElementById('signBoards').clientHeight/9*dummyDataUseable[nowCategoryNo][i]+document.getElementById('signBoards').clientWidth*0.08*0.1;
  for(let i=0;i<boardText.length;i++) pos[1][i]=boardContainerWidth/9*i+document.getElementById('signBoards').clientWidth*0.08*0.75;

  for(let i=0;i<boardText.length;i++){
    signBoardSrc+=`<div class="signBoard" style="bottom:${pos[0][i]}px;left:${pos[1][i]}px;"><div class="wrapper"><img src="img/signboard.png" /><p>${boardText[i]}</p></div></div>`;
  }

  document.getElementById('signBoards').innerHTML=signBoardSrc;
}

// function countDown(){
//   counter=document.getElementById('counter');
//   var countX=setInterval(()=>{
//     counter.textContent=--timesForNextPage;
//     if(timesForNextPage==0){
//       clearInterval(countX);
//     }
//   },1*1000);
//   setTimeout(()=>{
//     if(nowCategoryNo==0){
//       nowCategoryNo=1;
//     }
//     if(nowCategoryNo==1){
//       nowCategoryNo=0;
//     }
//     init();
//   },initTimesForNextPage*1000);
// }
