resource "local_file" "github_actions_info" {
  filename = "${path.module}/github_actions_info.txt"
  content = <<-EOT
    Repository: ${var.github_repository}
    Repository_id: ${var.github_repo_id}
    Branch: ${var.github_branch}
    Actor: ${var.github_actor}
  EOT
}

variable "github_repository" {
  description = "The GitHub repository"
  type        = string
}

variable "github_repo_id" {
    description = "The ID of the GitHub repository"
    type        = string
}

variable "github_branch" {
  description = "The branch of the GitHub repository"
  type        = string
}

variable "github_actor" {
  description = "The name of the person or app that initiated the workflow"
  type        = string
}
