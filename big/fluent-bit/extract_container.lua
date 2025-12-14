-- Lua script to extract container name from the log path
function extract_container_name(tag, timestamp, record)
    -- Extract container ID from tag (docker.var.lib.docker.containers.<container_id>.<container_id>-json.log)
    local container_id = string.match(tag, "docker%.var%.lib%.docker%.containers%.([^%.]+)%.")
    
    if container_id then
        record["container_id"] = string.sub(container_id, 1, 12)
    end
    
    return 1, timestamp, record
end
