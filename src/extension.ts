import * as path from 'path';
import * as vscode from 'vscode';
import fetch from 'node-fetch';
import { config } from 'dotenv';
config({ path: path.join(__dirname, '..', '.env') });

const MONGO_API_KEY: string = process.env.MONGO_API_KEY || '';
const MONGO_DB_NAME: string = process.env.DBNAME || '';
const MONGO_DATA_SRC: string = process.env.DATA_SRC || '';
const MONGO_API_ENDPOINT: string = process.env.MONGO_API_ENDPOINT || '';

const CLASS_CODE: string = process.env.CLASS_CODE || '';
const MIMAMORI_CODER_API_ENDPOINT: string = process.env.MIMAMORI_CODER_API_ENDPOINT || '';


const fetchData = async(endpoint: string, dataType: string, bodyData: any, isMongo: boolean) => {
  let option = {};

  let bodyCopy = JSON.parse(JSON.stringify(bodyData));
  if (isMongo) {
    bodyCopy['collection'] = dataType;
    bodyCopy['database'] = MONGO_DB_NAME;
    bodyCopy['dataSource'] = MONGO_DATA_SRC;
    option = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'api-key': MONGO_API_KEY
      },
      body: JSON.stringify(bodyCopy),
    };
  } else {
    bodyCopy['classCode'] = CLASS_CODE;
    option = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*'
      },
      body: JSON.stringify(bodyCopy)
    };
  }
  const res = await fetch(endpoint, option);
  const resJson = await res.json();
  return resJson;
};

export const activate = async(context: vscode.ExtensionContext) => {
  vscode.window.showInformationMessage('Mimamori-logger is activated.');
  let studentId: any = context.workspaceState.get('studentId');
  if (studentId === undefined) {
    studentId = await vscode.window.showInputBox();
    context.workspaceState.update('studentId', studentId);
    vscode.window.showInformationMessage(`Student ID ${studentId} is registered.`);
  } else {
    vscode.window.showInformationMessage(`Your student ID: ${studentId}`);
  }

  //Post data when the source code is saved
  vscode.workspace.onDidSaveTextDocument(async (document: vscode.TextDocument) => {
    const wsName: any = vscode.workspace.name;
    const savedDate: string = new Date().toLocaleString(); 
    const filePath = vscode.window.activeTextEditor === undefined ? '' : vscode.window.activeTextEditor.document.uri.fsPath;
    let bodyData = {};
    const dataType = document.languageId;
    if (filePath.indexOf(wsName) === -1) return;
    if (document.languageId === 'javascript') {
      studentId = context.workspaceState.get('studentId');
      const curretDir = path.join(filePath, '..');
      const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(curretDir));
      const targetFiles = files.filter(file => file[0].match(/.js|.html|.css/));

      let sources = [];
      for (const file of targetFiles) {
        const filename = file[0];
        const fileExtension = filename.split('.').pop();
        const targetPath = path.join(curretDir, filename);
        const targetUri = vscode.Uri.file(targetPath);
        const readData = await vscode.workspace.fs.readFile(targetUri);
        const fileContent = Buffer.from(readData).toString('utf8');
        sources.push({
          'fileExtension': fileExtension,
          'filename': filename,
          'content': fileContent,
        });
      }

      bodyData = {
        'document': {
          'studentId': studentId,
          'workspace': wsName,
          'savedAt': savedDate,
          'sources': sources
        }
      };
    } else if(document.languageId === 'python') {
      const pythonSource: string = document.getText();
      const filename = path.basename(filePath);
      bodyData = {
        'document': {
          'studentId': studentId,
          'workspace': wsName,
          'filename': filename,
          'savedAt': savedDate,
          'source': pythonSource
        }
      };
    }

    try {
      const res = await fetchData(MONGO_API_ENDPOINT, dataType, bodyData, true);
      //console.log(res);
    } catch (e: any) {
      vscode.window.showInformationMessage(e.message);
    }

    try {
      const res = await fetchData(MIMAMORI_CODER_API_ENDPOINT, dataType, bodyData, false);
      //console.log(res);
    } catch (e: any) {
      vscode.window.showInformationMessage(e.message);
    }
  });

  //Command for changing student ID
	const disposable = vscode.commands.registerCommand('mimamori-logger.change', async () => {
    const newId: any = await vscode.window.showInputBox();
    context.workspaceState.update('studentId', newId);
    vscode.window.showInformationMessage(`Your ID :${newId}`);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {};
