# Pipelines

Using shared pipelines introduces coupling. Once pipelines are in-use, it would be prudent to treat them as immutable i.e. when a change needs to be made, add a version suffix and migrate each service using the old version to the new.

e.g.

SAM-basic.cf-v1.yml
SAM-basic.cf-v2.yml
etc...
