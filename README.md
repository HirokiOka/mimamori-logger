# mimamori-logger

VS Code内で記述しているJavaScript, Pythonファイルのログをとる拡張機能です．
この拡張機能は，神戸大学で開講されている「情報発信演習1・2」「プログラミング基礎演習Ⅰ」の受講者の利用を想定して開発されました．

## 使い方

1. この拡張機能をインストールします．
2. VS Code内に入力ウィンドウが表示されるので，あなたの学籍番号を入力してください．
3. 再びVS Code内に入力ウィンドウが表示されるので，指定されたclass codeを入力してください．
4. セッティングはこれで終了です．JavaScriptファイルを保存するたびに，コードがデータベースに保存されます．


間違った学籍番号やclass codeを入力してしまった場合は，以下の手順で変更することができます．

# 学籍番号を間違えた場合
1. VSCodeでコマンドパレット（Windows: control + shift + p, Mac: command + shift + p）を開く．
2. コマンドパレットに「changeId」と入力し，「changeId」コマンドを実行する．
3. VS Codeに表示される入力ウィンドウに新しい学籍番号を入力する．

# class codeを間違えた場合
1. VSCodeでコマンドパレット（Windows: control + shift + p, Mac: command + shift + p）を開く．
2. コマンドパレットに「changeClassCode」と入力し，「changeClassCode」コマンドを実行する．
3. VS Codeに表示される入力ウィンドウに新しいclass codeを入力する．
