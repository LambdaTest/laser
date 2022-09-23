# laser
Front-end dashboard for Test at Scale.

## Build locally
To install dependencies:
```
npm install
```

To build application
```
npm run build
```

## Build docker image
Note: `make sure to change env if deploying in .env.local`
```
docker build -t lazer .
```

## Deploy in minikube
To deploy `lazer` in minikube environment we first need to merge docker and minikube environment, build image and deploy it.
```
eval $(minikube docker-env)
docker build -t lazer .
kubectl apply -f deployment/minikube/ 
```

