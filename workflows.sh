  
# read the workflow template
WORKFLOW_TEMPLATE=$(cat .github/workflow-template.yaml)

# iterate each route in routes directory
for SERVICE in $(ls services); do
	SERVICE_GOOD=$(echo ${SERVICE} | tr -d '/')
	echo "generating workflow for services/${SERVICE_GOOD}"

	# replace template route placeholder with route name
	WORKFLOW=$(echo "${WORKFLOW_TEMPLATE}" | sed "s/{{SERVICE}}/${SERVICE_GOOD}/g")
	
	# save workflow to .github/workflows/{ROUTE}
	echo "${WORKFLOW}" > .github/workflows/${SERVICE_GOOD}.yaml
done