import { createPiece } from '@activepieces/pieces-framework';
import { insertRowAction } from './lib/actions/insert-row.action';
import { readNewRows } from './lib/triggers/new-row-added';
import { deleteRowAction } from './lib/actions/delete-row.action';
import { updateRowAction } from './lib/actions/update-row';
import { findRowsAction } from './lib/actions/find-rows';

export const googleSheets = createPiece({
	logoUrl: 'https://cdn.activepieces.com/pieces/google-sheets.png',
	authors: ['abuaboud', 'AbdulTheActivepiecer', 'Shay Punter', 'Abdallah-Alwarawreh'],
	actions: [insertRowAction, deleteRowAction, updateRowAction, findRowsAction],
	displayName: "Google Sheets",
	triggers: [readNewRows],
});
