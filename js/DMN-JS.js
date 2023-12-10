export function Set_current_diagram(diagram, data) {
    // Le diagramme courant est placé dans l'historique du navigateur :
    window.history.replaceState({
        data: data,
        diagram: diagram
    }, "");
}
const _DMN_AuthorityRequirement = 'dmn:AuthorityRequirement';
const _DMN_BusinessKnowledgeModel = 'dmn:BusinessKnowledgeModel';
const _DMN_Decision = 'dmn:Decision';
const _DMN_DecisionRule = 'dmn:DecisionRule';
const _DMN_DecisionTable = 'dmn:DecisionTable';
const _DMN_Definitions = 'dmn:Definitions';
const _DMN_DMNElementReference = 'dmn:DMNElementReference';
const _DMN_InformationItem = 'dmn:InformationItem';
const _DMN_InformationRequirement = 'dmn:InformationRequirement';
const _DMN_InputClause = 'dmn:InputClause';
const _DMN_InputData = 'dmn:InputData';
const _DMN_KnowledgeRequirement = 'dmn:KnowledgeRequirement';
const _DMN_KnowledgeSource = 'dmn:KnowledgeSource';
const _DMN_LiteralExpression = 'dmn:LiteralExpression';
const _DMN_OutputClause = 'dmn:OutputClause';
const _DMN_UnaryTests = 'dmn:UnaryTests';
export function is_DMN_Decision(me) {
    return '$type' in me && me.$type === _DMN_Decision && 'decisionLogic' in me;
}
export function is_DMN_Definitions(me) {
    return '$type' in me && me.$type === _DMN_Definitions && 'drgElement' in me;
}
export function is_DMN_InformationRequirement(me) {
    return '$type' in me && me.$type === _DMN_InformationRequirement && 'requiredInput' in me;
}
export function is_DMN_InputData(me) {
    return '$type' in me && me.$type === _DMN_InputData;
}
