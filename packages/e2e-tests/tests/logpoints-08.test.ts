import test, { expect } from "@playwright/test";

import { openDevToolsTab, startTest } from "../helpers";
import { findConsoleMessage } from "../helpers/console-panel";
import { addLogpoint, jumpToLogPointHit, verifyLogpointStep } from "../helpers/source-panel";

const url = "doc_rr_basic.html";

test(`logpoints-08: should support jumping directly to a hit point via the capsule input`, async ({
  page,
}) => {
  await startTest(page, url);
  await openDevToolsTab(page);

  await addLogpoint(page, {
    content: '"Logpoint"',
    lineNumber: 20,
    url,
  });

  const logPointMessages = await findConsoleMessage(page, "Logpoint", "log-point");
  await expect(logPointMessages).toHaveCount(10);

  await jumpToLogPointHit(page, 5, { lineNumber: 20 });
  await verifyLogpointStep(page, "5/10", { lineNumber: 20 });

  // Bounds checking
  await jumpToLogPointHit(page, 15, { lineNumber: 20 });
  await verifyLogpointStep(page, "10/10", { lineNumber: 20 });
  await jumpToLogPointHit(page, 0, { lineNumber: 20 });
  await verifyLogpointStep(page, "1/10", { lineNumber: 20 });
});
