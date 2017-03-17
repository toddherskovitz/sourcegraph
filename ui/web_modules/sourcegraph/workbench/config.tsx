import { Features } from "sourcegraph/util/features";
import { ContextMenuController } from "vs/editor/contrib/contextmenu/browser/contextmenu";
import { IInstantiationService } from "vs/platform/instantiation/common/instantiation";
import { ServiceCollection } from "vs/platform/instantiation/common/serviceCollection";
import { Registry } from "vs/platform/platform";
import { IStorageService, StorageScope } from "vs/platform/storage/common/storage";
import { StorageService } from "vs/platform/storage/common/storageService";
import { EditorGroupsControl } from "vs/workbench/browser/parts/editor/editorGroupsControl";
import { Extensions as viewKey, ViewletRegistry } from "vs/workbench/browser/viewlet";
import { FileRenderer } from "vs/workbench/parts/files/browser/views/explorerViewer";
import { VIEWLET_ID } from "vs/workbench/parts/files/common/files";
import { IActivityBarService } from "vs/workbench/services/activity/common/activityBarService";

import { layout } from "sourcegraph/components/utils";

// Set the height of files in the file tree explorer.
(FileRenderer as any).ITEM_HEIGHT = 30;

// Set the height of the blob title.
(EditorGroupsControl as any).EDITOR_TITLE_HEIGHT = layout.EDITOR_TITLE_HEIGHT;

export function configurePreStartup(services: ServiceCollection): void {
	const instantiationService = services.get(IInstantiationService) as IInstantiationService;

	const storageService = instantiationService.createInstance((StorageService as any), window.localStorage, window.localStorage) as IStorageService;
	services.set(IStorageService, storageService);

	const viewReg = (Registry.as(viewKey.Viewlets) as ViewletRegistry);
	viewReg.setDefaultViewletId(VIEWLET_ID);

	const key = "workbench.sidebar.width";
	storageService.store(key, 300, StorageScope.GLOBAL);
}

// Workbench overwrites a few services, so we add these services after startup.
export function configurePostStartup(services: ServiceCollection): void {
	(ContextMenuController.prototype as any)._onContextMenu = () => { /* */ };

	if (Features.zapChanges.isEnabled()) {
		const activityBarService = services.get(IActivityBarService) as IActivityBarService;
		activityBarService.pin("workbench.view.scm");
	}
}
