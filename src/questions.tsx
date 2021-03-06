import React from 'react';

interface Question {
  question: JSX.Element;
  summary: JSX.Element;
}

export const questions = [
  {
    question: (
      <>
        <p>
          サンタさんが一晩に世界中の子供たちにプレゼントを届けないといけないけど東京の地下鉄があまりにも複雑で迷ってしまいました🎅
          <br />
          以下の写真の駅はどこか教えてください！（一つだけでも助かる！）
        </p>
        <div className="photos">
          <img src="/img/shinkoiwa.jpg" />
          <img src="/img/monzennakacho.jpg" />
          <img src="/img/hongosanchome.jpg" />
          <img src="/img/toyosu.jpg" />
        </div>
        <p className="hint">
          <strong>ヒント：</strong>
          すべての駅は今日のメンバーの誰かの最寄り駅です。
        </p>
      </>
    ),
    summary: '駅の名前を教えてください',
  },
  {
    question: (
      <>
        <p>世界中様々なクリスマス料理がありますが、これはなんでしょうか？</p>
        <div className="photos">
          <img src="/img/cakewich.jpg" />
        </div>
        <p>
          もしケーキがサンドウィッチと結婚したら、どんな子供が生まれる？🍰🥪💒
        </p>
        <p className="hint">
          <strong>ヒント：</strong>
          横浜に在住する優しい子が知っている。
        </p>
      </>
    ),
    summary:
      'もしケーキがサンドウィッチと結婚したら、どんな子供が生まれる？🍰🥪💒',
  },
  {
    question: (
      <>
        <p>
          クリスマスにプレゼント交換する人がいます🎁
          <br />
          それはイエスが生まれたとき、アジアから博士たちが来て、イエスにプレゼントをあげたからです。
        </p>
        <div className="photos">
          <img src="/img/wisemen.jpg" />
        </div>
        <p>博士たちがあげたプレゼント一つを教えてください。</p>
        <p className="hint">
          <strong>ヒント：</strong>
          少なくとも３種類のプレゼントありました。
          クリスマスに教会に行ったことのある人は知っているかなぁ。 （または
          <a
            href="http://bible.salterrae.net/kougo/html/matthew.html#2"
            target="_blank"
          >
            聖書
          </a>
          で調べられる。）
        </p>
      </>
    ),
    summary: '博士たちが何をイエスにあげた？',
  },
  {
    question: (
      <>
        <p>以下のプレゼントのなかからもらいたい人は誰ですか？</p>
        <ul>
          <li>スティッキーバンプス春秋用ワックス</li>
          <li>サラブレッド浪漫</li>
          <li>トマス</li>
        </ul>
      </>
    ),
    summary: (
      <>
        <p>だれがこのプレゼントをほしい？</p>
        <ul>
          <li>スティッキーバンプス春秋用ワックス</li>
          <li>サラブレッド浪漫</li>
          <li>トマス</li>
        </ul>
      </>
    ),
  },
];
