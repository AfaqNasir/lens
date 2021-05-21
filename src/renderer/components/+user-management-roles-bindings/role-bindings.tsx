/**
 * Copyright (c) 2021 OpenLens Authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import "./role-bindings.scss";

import React from "react";
import { observer } from "mobx-react";
import type { RouteComponentProps } from "react-router";
import type { IRoleBindingsRouteParams } from "../+user-management/user-management.route";
import { roleBindingsStore } from "./role-bindings.store";
import { KubeObjectListLayout } from "../kube-object";
import { AddRoleBindingDialog } from "./add-role-binding-dialog";
import { KubeObjectStatusIcon } from "../kube-object-status-icon";

enum columnId {
  name = "name",
  namespace = "namespace",
  bindings = "bindings",
  age = "age",
}

interface Props extends RouteComponentProps<IRoleBindingsRouteParams> {
}

@observer
export class RoleBindings extends React.Component<Props> {
  render() {
    return (
      <KubeObjectListLayout
        isConfigurable
        tableId="access_role_bindings"
        className="RoleBindings"
        store={roleBindingsStore}
        sortingCallbacks={{
          [columnId.name]: binding => binding.getName(),
          [columnId.namespace]: binding => binding.getNs(),
          [columnId.bindings]: binding => binding.getSubjectNames(),
          [columnId.age]: binding => binding.getTimeDiffFromNow(),
        }}
        searchFilters={[
          binding => binding.getSearchFields(),
          binding => binding.getSubjectNames(),
        ]}
        renderHeaderTitle="Role Bindings"
        renderTableHeader={[
          { title: "Name", className: "name", sortBy: columnId.name, id: columnId.name },
          { className: "warning", showWithColumn: columnId.name },
          { title: "Namespace", className: "namespace", sortBy: columnId.namespace, id: columnId.namespace },
          { title: "Bindings", className: "bindings", sortBy: columnId.bindings, id: columnId.bindings },
          { title: "Age", className: "age", sortBy: columnId.age, id: columnId.age },
        ]}
        renderTableContents={binding => [
          binding.getName(),
          <KubeObjectStatusIcon key="icon" object={binding} />,
          binding.getNs() || "-",
          binding.getSubjectNames(),
          binding.getAge(),
        ]}
        addRemoveButtons={{
          onAdd: () => AddRoleBindingDialog.open(),
          addTooltip: "Create new RoleBinding",
        }}
      />
    );
  }
}
