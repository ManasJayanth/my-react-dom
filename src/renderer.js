import ReactReconciler from 'react-reconciler';

const hostConfig = {
  getRootHostContext(rootContainerInstance) {
    return {}
  },

  getChildHostContext(parentHostContext, type, rootContainerInstance) {
    return {};
  },

  getPublicInstance(instance) {
    console.log('getPublicInstance');
  },

  prepareForCommit(containerInfo) {
    // console.log('prepareForCommit');
  },

  resetAfterCommit(containerInfo) {
    // console.log('resetAfterCommit');
  },

  createInstance(
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    // console.log(
    //   'createInstance',
    //   type,
    //   props,
    //   rootContainerInstance,
    //   hostContext,
    // );
    return document.createElement(type);
  },

  appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child)
  },

  finalizeInitialChildren(
    domElement,
    type,
    props,
    rootContainerInstance,
    hostContext
  ) {
    const { children, ...otherProps } = props;
    Object.keys(otherProps).forEach(attr => {
      if (attr === 'className') {
        domElement.className = otherProps[attr];
      } else if (attr === 'onClick') {
        const listener = otherProps[attr];
        if (domElement.__ourVeryHackCacheOfEventListeners) {
          domElement.__ourVeryHackCacheOfEventListeners.push(listener)
        } else {
          domElement.__ourVeryHackCacheOfEventListeners = [ listener ]
        }
        domElement.addEventListener('click', listener);
      } else {
        throw new Error('TODO: We haven\'t handled other properties/attributes')
      }
    })
    // console.log('finalizeInitialChildren', domElement, type, props, rootContainerInstance, hostContext);
  },

  prepareUpdate(
    domElement,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    hostContext
  ) {
    const propKeys = new Set(
      Object.keys(newProps).concat(
        Object.keys(oldProps)
      )
    ).values();
    const payload = [];
    for (let key of propKeys) {
      if (
        key !== 'children' && // text children are already handled
        oldProps[key] !== newProps[key]
      ) {
        payload.push({ [key]: newProps[key] })
      }
    }
    return payload;
  },

  shouldSetTextContent(type, props) {
    return false; // || true;
  },

  shouldDeprioritizeSubtree(type, props) {
    console.log('shouldDeprioritizeSubtree');
  },

  createTextInstance(
    text,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    // console.log(
    //   'createTextInstance',
    //   text,
    //   rootContainerInstance,
    //   hostContext,
    // );
    return document.createTextNode(text);
  },

  now: Date.now,

  isPrimaryRenderer: true,
  scheduleDeferredCallback: "",
  cancelDeferredCallback: "",

  // -------------------
  //     Mutation
  // -------------------

  supportsMutation: true,

  commitMount(domElement, type, newProps, internalInstanceHandle) {
    console.log('commitMount');
  },

  commitUpdate(
    domElement,
    updatePayload,
    type,
    oldProps,
    newProps,
    internalInstanceHandle
  ) {
    updatePayload.forEach(update => {
      Object.keys(update).forEach(key => {
        if (key === 'onClick') {
          domElement.__ourVeryHackCacheOfEventListeners.forEach(listener => { // To prevent leak
            domElement.removeEventListener('click', listener)
          })
          domElement.__ourVeryHackCacheOfEventListeners = [ update[key] ];
          domElement.addEventListener('click', update[key])
        } else {
          domElement[key] = update[key];
        }
      })
    })
  },

  resetTextContent(domElement) {
    console.log('resetTextContent');
  },

  commitTextUpdate(textInstance, oldText, newText) {
    // console.log('commitTextUpdate', oldText, newText);
    textInstance.nodeValue = newText;
  },

  appendChild(parentInstance, child) {
    console.log('appendChild');
  },

  appendChildToContainer(container, child) {
    // console.log('appendChildToContainer', container, child);
    container.appendChild(child)
  },

  insertBefore(parentInstance, child, beforeChild) {
    console.log('insertBefore');
  },

  insertInContainerBefore(container, child, beforeChild) {
    console.log('insertInContainerBefore');
  },

  removeChild(parentInstance, child) {
    console.log('removeChild');
  },

  removeChildFromContainer(container, child) {
    console.log('removeChildFromContainer');
  }
};


const DOMRenderer = ReactReconciler(hostConfig);

let internalContainerStructure;
export default {
  render(elements, containerNode, callback) {

    // We must do this only once
    if (!internalContainerStructure) {
      internalContainerStructure = DOMRenderer.createContainer(
        containerNode,
        false,
        false
      );
    }

    DOMRenderer.updateContainer(elements, internalContainerStructure, null, callback);
  }
}
