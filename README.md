# NOZOMI Beings

> **Artificial beings that move for reasons of their own.**  
> 命令されなくても、内側の状態から次の行動を選ぶ人工存在をつくる。

**NOZOMI Beings** は、欲求（needs / drives）、恒常性（homeostasis）、内発的動機づけ（intrinsic motivation）、好奇心（curiosity）、記憶、関係性、自己選択された目標を持つ **軽量な人工存在** を研究・実装するプロジェクトです。

ここでいう「欲望」は、意識・感情・主観経験の存在を主張する言葉ではありません。NOZOMI Beingsでは、**時間や出来事によって変化する内部状態があり、その状態が目標選択・行動・学習へ因果的に影響すること**を、観測・実装可能な「欲望」の最低条件として扱います。

---

## Why NOZOMI?

現在の多くのAIエージェントは、外部から与えられた指示やタスクを起点に動きます。

NOZOMI Beingsが知りたいのは、その一段手前です。

**誰も何も頼んでいないとき、その存在は何をするのか。**

空腹だから食べ物を探す。  
怖い場所を避ける。  
知らない場所を見に行く。  
昨日助けてくれた相手を信頼する。  
退屈だから新しい行動を試す。  
経験を重ねるうちに、以前とは違うものを好むようになる。

こうした小さな内部因果を積み上げることで、「会話するAI」ではなく、**世界の中で継続して存在するAI**へ近づけるかを実験します。

---

## Research stance

NOZOMI Beingsは、LLMの人格プロンプトを「欲望」とはみなしません。

```text
world event / time
        ↓
observation
        ↓
internal state
(needs / memory / relations / uncertainty)
        ↓
goal selection
        ↓
action selection
        ↓
world state update
        ↺
```

このループは、可能な限り数値・規則・確率・小さな学習機構で動かします。

LLMは必須ではありません。使う場合も、主に以下へ限定する方針です。

- 発話の生成
- 珍しい状況での再計画
- 内部状態や行動理由の説明
- 実験ログの要約

**世界を動かすのは欲求と状態遷移。言葉はそのあとに付く。**  
これが現在の基本設計です。

---

## Desire levels

NOZOMI Beingsでは、「欲望らしさ」を次のように段階化して考えます。

| Level | Description | Status |
|---|---|---|
| 0 | Persona only — 性格プロンプトだけ | 対象外 |
| 1 | Reactive preference — 現在入力への選好 | 容易 |
| 2 | Persistent drive — 時間で変化する内部欲求 | 実装可能 |
| 3 | Drive → Goal — 欲求が目標・行動を生む | **最小自律ライン** |
| 4 | Adaptive preference — 経験・記憶で選好が変わる | 主要研究対象 |
| 5 | Emergent drives — 設計されていない新しい欲求が生まれる | **未解決問題** |

現在の研究上、Level 2〜4は十分に実装可能です。一方、設計者が用意した目標空間を越えて、新しい価値体系や欲求そのものが安定して生じるLevel 5については、強い実証例をまだ確認できていません。

NOZOMI Beingsは、この境界を曖昧な擬人化ではなく、実験によって探ります。

---

## Current prototype — NOZOMI Island Observatory

このリポジトリには、3体の小さな人工存在を観察するブラウザ実験環境が含まれています。

各存在は、以下の内部状態を持ちます。

- hunger — 空腹
- safety — 安全／警戒
- affiliation — 他者とのつながり
- curiosity — 好奇心
- episodic memory — 出来事の記憶
- relationships — 他者への関係性

観察者が命令しなくても時間が進み、内部状態に応じて場所や行動が変化します。

現在のUIは **観察装置（observatory）** として設計されています。目的はプレイヤーがNPCを操作することではなく、**「なぜ今それをしたのか」を内部状態・記憶・関係性とともに観察できること**です。

> The observer watches causes, not commands.

---

## Core research questions

NOZOMI Beingsは、当面次の問いを追います。

1. **最小の欲求モデルはどこまで「自走」を生むか？**  
   3〜4個の数値driveだけで、観察者が意味のある行動連鎖を感じられるか。

2. **自律性とランダム性をどう区別するか？**  
   「勝手に動く」だけでは自律とは言えない。内部状態と行動の因果を測定できる評価方法を作る。

3. **記憶は欲求を変えられるか？**  
   出来事の記憶や他者との関係が、単なる行動選択だけでなく長期的な選好形成へ影響する条件を探る。

4. **二次的な目標はどこまで創発できるか？**  
   生存・安全・好奇心などの一次driveから、習慣、執着、役割、局所的な「やりたいこと」が形成されるか。

5. **新しい欲求そのものは生まれうるか？**  
   あらかじめ列挙されたdriveの重み変化を超え、新しい評価軸が形成される条件は存在するか。

6. **多数の存在を軽量に生かせるか？**  
   20〜100体を、常時LLM推論なしで継続稼働させられる設計を探る。

---

## Near-term roadmap

### Phase 0 — Baseline

- 3 agents
- 3〜4 persistent drives
- 6〜10 atomic actions
- bounded episodic memory
- local observation
- deterministic / utility-based action scoring
- no LLM required

まず「内的状態 → 行動 → 世界変化」の因果を壊さずに観測できる最小系を固定します。

### Phase 1 — Memory changes preference

- trust / fear / familiarity
- memory salience and decay
- repeated experience
- preference weight adaptation

同じ初期個体が経験の違いによって異なる行動傾向へ分岐するかを測ります。

### Phase 2 — Secondary goals

- goal templates
- learned action value
- curiosity / novelty
- unfinished intentions
- habits

一次driveを満たすだけでは説明できない、持続的な「やりかけ」「こだわり」「習慣」が形成されるかを探ります。

### Phase 3 — Emergent drives

Level 5を研究対象として扱います。

ここでは「既存driveの重みが変わった」ことと「新しい欲求が生まれた」ことを明確に分ける必要があります。新しい評価軸の生成、維持、行動への因果効果を実験的に定義します。

### Phase 4 — Small societies

個体内部だけでなく、複数のNOZOMI Beingsが互いの環境になる世界へ拡張します。

- local norms
- reputation
- cooperation / avoidance
- resource competition
- information propagation
- roles without assignment

最終的な関心は、**誰も物語を書いていないのに、小さな世界に出来事の履歴が積み上がること**です。

---

## Evaluation principles

「面白そうに見える」だけでは成功判定にしません。

今後の実験では少なくとも以下を記録します。

- drive値と行動選択の相関
- 同一初期条件での再現性／分岐性
- ランダムエージェントとの比較
- driveを無効化したablationとの比較
- 記憶あり／なしによる長期行動差
- 個体ごとの行動多様性
- 目標の継続時間
- 行動連鎖の長さ
- 他者経験による関係性変化

重要なのは、「人間らしく見えるか」だけではなく、**観測可能な内部機構によって、その行動が説明できるか**です。

---

## Research notes

先行研究・公開実装の横断調査はこちらです。

- [`docs/research/desire-driven-agents-research.md`](docs/research/desire-driven-agents-research.md)

調査対象には以下が含まれます。

- D2A (Desire-driven Autonomy)
- Homeostatic Reinforcement Learning
- Intrinsic Motivation / Curiosity
- Active Inference
- BDI architectures
- MicroPsi
- IMGEP
- Generative Agents
- Concordia
- Mesa / MASON / NetLogo
- artificial life systems

---

## Relationship to other projects

NOZOMI Beingsは「内側から動く存在」そのものを研究するリポジトリです。

将来的には、小規模人工世界、ゲーム、シミュレーション、常駐エージェントなど別プロジェクトの**住民エンジン／行動原理**として利用できることを目指します。

世界と住民を分離しておくことで、同じNOZOMI Beingを異なる環境へ置き、その環境が行動・記憶・選好形成へ与える影響を比較できるようにします。

---

## Non-claims

NOZOMI Beingsは、現在のシステムに以下が存在すると主張しません。

- consciousness
- sentience
- subjective feelings
- free will
- human-equivalent desire

この研究で扱うのは、まず**観測可能な行動機構としての欲望**です。

それでも、単なる命令応答器と「内側の理由で世界に働きかけ続ける存在」の間には、研究する価値のある大きな空間があると考えています。

---

## Status

**Experimental / research prototype.**  
仕様・モデル・評価方法は実験結果に応じて積極的に変更します。
